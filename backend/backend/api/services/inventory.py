from django.db import transaction
from ..models import Product, InventoryLog

def update_product_stock(product, quantity_change, change_type, reason):
    """
    Updates product stock and logs the change.
    quantity_change can be positive (restock) or negative (sale).
    """
    with transaction.atomic():
        product = Product.objects.select_for_update().get(pk=product.pk)
        previous_stock = product.stock_quantity
        new_stock = previous_stock + quantity_change
        
        if new_stock < 0:
            raise ValueError(f"Insufficient stock for {product.name}. Current: {previous_stock}")
            
        product.stock_quantity = new_stock
        product._skip_inventory_log = True # Prevent double logging in signal
        product.save()
        
        InventoryLog.objects.create(
            product=product,
            change_type=change_type,
            quantity_changed=quantity_change,
            previous_stock=previous_stock,
            new_stock=new_stock,
            reason=reason
        )
    return product
