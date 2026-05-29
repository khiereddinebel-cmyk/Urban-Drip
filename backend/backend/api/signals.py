from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import OrderItem, InventoryLog, Order, Product, Notification
from .services.inventory import update_product_stock
from .services.google_sheets import append_order_to_sheets

from django.db import transaction

@receiver(post_save, sender=Order)
def create_order_notifications(sender, instance, created, **kwargs):
    if created:
        # Create In-App Notification
        Notification.objects.create(
            message=f"🆕 New Order #{instance.order_number} received",
            order=instance
        )
        # Export to Google Sheets after transaction is committed to ensure items exist
        transaction.on_commit(lambda: append_order_to_sheets(instance))

@receiver(pre_save, sender=Order)
def track_order_status_change(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_order = Order.objects.get(pk=instance.pk)
            if old_order.status != instance.status:
                msg = None
                if instance.status == 'Assigned':
                    msg = f"🚚 Driver assigned to Order #{instance.order_number}"
                elif instance.status == 'Delivered':
                    msg = f"✅ Order #{instance.order_number} delivered"
                elif instance.status == 'Cancelled':
                    msg = f"❌ Order #{instance.order_number} cancelled"
                
                if msg:
                    Notification.objects.create(
                        message=msg,
                        order=instance
                    )
        except Order.DoesNotExist:
            pass

@receiver(post_save, sender=OrderItem)
def update_stock_and_order_totals(sender, instance, created, **kwargs):
    if created:
        # Reduce stock via service
        product = instance.product
        if product:
            try:
                update_product_stock(
                    product=product,
                    quantity_change=-instance.quantity,
                    change_type='SALE',
                    reason=f"Sale in Order {instance.order.order_number}"
                )
            except ValueError as e:
                # In a real API, this would return 400. In admin, logs might catch it.
                # Here we just log it or notify the admin
                print(f"Stock error: {e}")
                
    # Always update Order totals
    order = instance.order
    items = order.items.all()
    order.total_items = sum(item.quantity for item in items)
    order.total_price = sum(item.price * item.quantity for item in items)
    order.order_profit = sum((item.price - item.cost_price) * item.quantity for item in items)
    order.save()

@receiver(post_delete, sender=OrderItem)
def restore_stock_on_item_delete(sender, instance, **kwargs):
    # Restore stock via service
    product = instance.product
    if product:
        update_product_stock(
            product=product,
            quantity_change=instance.quantity,
            change_type='RESTOCK',
            reason=f"Item removed from Order {instance.order.order_number}"
        )
    
    # Update Order totals
    order = instance.order
    items = order.items.all()
    order.total_items = sum(item.quantity for item in items)
    order.total_price = sum(item.price * item.quantity for item in items)
    order.order_profit = sum((item.price - item.cost_price) * item.quantity for item in items)
    order.save()

@receiver(pre_save, sender=Product)
def track_manual_stock_change(sender, instance, **kwargs):
    # Check for flag set by inventory service
    if getattr(instance, '_skip_inventory_log', False):
        return

    if instance.pk:
        try:
            old_product = Product.objects.get(pk=instance.pk)
            if old_product.stock_quantity != instance.stock_quantity:
                diff = instance.stock_quantity - old_product.stock_quantity
                # Create a manual log directly
                InventoryLog.objects.create(
                    product=instance,
                    change_type='MANUAL',
                    quantity_changed=diff,
                    previous_stock=old_product.stock_quantity,
                    new_stock=instance.stock_quantity,
                    reason="Admin manual stock adjustment"
                )
        except Product.DoesNotExist:
            pass
    else:
        # It's a brand new product creation
        # Still create an initial log if starting stock > 0
        if instance.stock_quantity > 0:
            # We must be careful because in pre_save, the ID is not yet assigned if new.
            # So a post_save might be better for NEW products.
            pass

@receiver(post_save, sender=Product)
def track_new_product_stock(sender, instance, created, **kwargs):
    if created and instance.stock_quantity > 0:
        InventoryLog.objects.get_or_create(
            product=instance,
            change_type='MANUAL',
            quantity_changed=instance.stock_quantity,
            defaults={
                'previous_stock': 0,
                'new_stock': instance.stock_quantity,
                'reason': "Initial stock for new product"
            }
        )
