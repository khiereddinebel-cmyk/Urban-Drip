from django.db import transaction
from .inventory import update_product_stock
from ..models import Order, OrderItem

def change_order_status(order, new_status):
    """
    Updates order status and handles stock restoration if cancelled.
    """
    with transaction.atomic():
        old_status = order.status
        if old_status == new_status:
            return order
            
        # Check for stock restoration on cancellation
        if new_status == 'Cancelled' and old_status != 'Cancelled':
            for item in order.items.all():
                if item.product:
                    update_product_stock(
                        product=item.product,
                        quantity_change=item.quantity,
                        change_type='RESTOCK',
                        reason=f"Stock restored for Cancelled Order {order.order_number}"
                    )
        
        # Check for stock reduction if re-activating a cancelled order
        elif old_status == 'Cancelled' and new_status != 'Cancelled':
            for item in order.items.all():
                if item.product:
                    update_product_stock(
                        product=item.product,
                        quantity_change=-item.quantity,
                        change_type='SALE',
                        reason=f"Stock reduced for Reactivated Order {order.order_number}"
                    )

        order.status = new_status
        order.save()
    return order
