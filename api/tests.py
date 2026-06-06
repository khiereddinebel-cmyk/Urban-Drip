from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
from .models import Product, Order, OrderItem, Brand, Category

class OrderSystemTestCase(APITestCase):
    def setUp(self):
        # Create dependencies for product
        self.brand = Brand.objects.create(name="Nike", slug="nike")
        self.category = Category.objects.create(name="Sneakers", slug="sneakers")
        
        # Create a product with stock
        self.product = Product.objects.create(
            name="Air Max",
            price=2000.00,
            brand=self.brand,
            category=self.category,
            stock=10,
            is_active=True
        )
        
        # Create a second product with stock
        self.product2 = Product.objects.create(
            name="Jordan 1",
            price=3000.00,
            brand=self.brand,
            category=self.category,
            stock=5,
            is_active=True
        )

        self.order_url = reverse('order-list')  # Typically DRF router maps this to OrderViewSet's list/create

    def test_successful_order_placement(self):
        """Test that a valid checkout request creates order, items, and decrements stock."""
        payload = {
            "customer_name": "Test User",
            "customer_phone": "0555123456",
            "customer_email": "test@example.com",
            "shipping_address": "123 Street, Alger",
            "wilaya": "Alger",
            "baladiya": "Sidi M'Hamed",
            "delivery_fee": 600,
            "delivery_type": "home",
            "total_price": 4600,
            "items": [
                {
                    "product": self.product.id,
                    "quantity": 2,
                    "size": "42",
                    "price": 2000.00
                }
            ]
        }
        
        response = self.client.post(self.order_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data.get("success"))
        self.assertIn("order_number", response.data)
        
        # Verify order created in database
        order = Order.objects.get(order_number=response.data["order_number"])
        self.assertEqual(order.customer_name, "Test User")
        self.assertEqual(order.items.count(), 1)
        
        # Verify stock decremented
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 8)

    def test_validation_missing_required_fields(self):
        """Test that missing phone, address, or wilaya fails validation and returns standard error structure."""
        payload = {
            "customer_name": "Test User",
            # customer_phone is missing
            "customer_email": "test@example.com",
            "shipping_address": "", # shipping_address is empty
            "wilaya": "Alger",
            "baladiya": "Sidi M'Hamed",
            "delivery_fee": 600,
            "delivery_type": "home",
            "total_price": 4600,
            "items": [
                {
                    "product": self.product.id,
                    "quantity": 2,
                    "size": "42",
                    "price": 2000.00
                }
            ]
        }
        
        response = self.client.post(self.order_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.get("success"))
        self.assertIn("error", response.data)
        # Verify that specific errors are reported in the flat error string
        self.assertIn("customer_phone", response.data["error"])
        self.assertIn("shipping_address", response.data["error"])

    def test_out_of_stock_validation(self):
        """Test that order fails when product has insufficient stock, and does not save order."""
        payload = {
            "customer_name": "Test User",
            "customer_phone": "0555123456",
            "customer_email": "test@example.com",
            "shipping_address": "123 Street, Alger",
            "wilaya": "Alger",
            "baladiya": "Sidi M'Hamed",
            "delivery_fee": 600,
            "delivery_type": "home",
            "total_price": 22600,
            "items": [
                {
                    "product": self.product.id,
                    "quantity": 11,  # Stock is only 10
                    "size": "42",
                    "price": 2000.00
                }
            ]
        }
        
        response = self.client.post(self.order_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.get("success"))
        self.assertIn("error", response.data)
        self.assertIn("Stock insuffisant pour", response.data["error"])
        
        # Verify that order was NOT saved in database
        self.assertEqual(Order.objects.count(), 0)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 10) # Stock remains unchanged

    def test_telegram_bot_failure_safe_save(self):
        """Test that Telegram notification exception does not interrupt order saving or checkout completion."""
        payload = {
            "customer_name": "Test User",
            "customer_phone": "0555123456",
            "customer_email": "test@example.com",
            "shipping_address": "123 Street, Alger",
            "wilaya": "Alger",
            "baladiya": "Sidi M'Hamed",
            "delivery_fee": 600,
            "delivery_type": "home",
            "total_price": 2600,
            "items": [
                {
                    "product": self.product.id,
                    "quantity": 1,
                    "size": "42",
                    "price": 2000.00
                }
            ]
        }
        
        # Patch the send_order_notifications function to raise an exception
        with patch('api.services.notifications.send_order_notifications', side_effect=Exception("Telegram connection failed")):
            response = self.client.post(self.order_url, payload, format='json')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertTrue(response.data.get("success"))
            
            # Verify order is saved
            self.assertEqual(Order.objects.count(), 1)
            # Verify stock is decremented
            self.product.refresh_from_db()
            self.assertEqual(self.product.stock, 9)

    def test_transaction_rollback_multi_item(self):
        """Test that if one item fails stock checks in a multi-item order, the entire order rolls back and no stock is changed."""
        payload = {
            "customer_name": "Test User",
            "customer_phone": "0555123456",
            "customer_email": "test@example.com",
            "shipping_address": "123 Street, Alger",
            "wilaya": "Alger",
            "baladiya": "Sidi M'Hamed",
            "delivery_fee": 600,
            "delivery_type": "home",
            "total_price": 20600,
            "items": [
                {
                    "product": self.product.id,  # has 10 stock
                    "quantity": 5,
                    "size": "42",
                    "price": 2000.00
                },
                {
                    "product": self.product2.id, # has 5 stock
                    "quantity": 6,               # requests 6 (insufficient)
                    "size": "43",
                    "price": 3000.00
                }
            ]
        }
        
        response = self.client.post(self.order_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.get("success"))
        
        # Verify no order is saved in the database
        self.assertEqual(Order.objects.count(), 0)
        self.assertEqual(OrderItem.objects.count(), 0)
        
        # Verify no product stock is decremented (transaction rollback)
        self.product.refresh_from_db()
        self.product2.refresh_from_db()
        self.assertEqual(self.product.stock, 10)
        self.assertEqual(self.product2.stock, 5)
