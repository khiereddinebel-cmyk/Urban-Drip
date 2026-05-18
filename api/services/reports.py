from django.db.models import Sum, Count, F, ExpressionWrapper, DecimalField
from django.db.models.functions import TruncDay, TruncMonth
from ..models import Order, OrderItem, Product

from django.utils import timezone
from datetime import timedelta

def get_sales_overview():
    """
    Returns high-level sales statistics including today's metrics.
    """
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Active orders (not cancelled)
    active_orders = Order.objects.exclude(status='Cancelled')
    
    # Global stats
    stats = active_orders.aggregate(
        total_orders=Count('id'),
        total_revenue=Sum('total_price'),
        total_profit=Sum('order_profit'),
        total_items_sold=Sum('total_items')
    )
    
    # Today's stats
    today_stats = active_orders.filter(created_at__gte=today_start).aggregate(
        orders=Count('id'),
        revenue=Sum('total_price'),
        profit=Sum('order_profit')
    )
    
    # Low stock items (< 5)
    low_stock_products = Product.objects.filter(stock_quantity__lt=5).select_related('brand')[:10]
    
    # Pending orders count
    pending_orders_count = Order.objects.filter(status='Pending').count()
    
    # Top selling products based on quantity sold
    top_selling = OrderItem.objects.exclude(
        order__status='Cancelled'
    ).values(
        'product__name', 'product__brand__name'
    ).annotate(
        sold_quantity=Sum('quantity'),
        revenue=Sum(F('price') * F('quantity'))
    ).order_by('-sold_quantity')[:5]
    
    return {
        'stats': stats,
        'today': today_stats,
        'low_stock': low_stock_products,
        'pending_count': pending_orders_count,
        'top_products': top_selling
    }

def get_daily_reports():
    """
    Daily sales data for charts.
    """
    return Order.objects.exclude(status='Cancelled').annotate(
        date=TruncDay('created_at')
    ).values('date').annotate(
        orders_count=Count('id'),
        revenue=Sum('total_price'),
        profit=Sum('order_profit')
    ).order_by('date') # Ascending for charts

def get_monthly_reports():
    """
    Monthly sales data.
    """
    return Order.objects.exclude(status='Cancelled').annotate(
        month=TruncMonth('created_at')
    ).values('month').annotate(
        orders_count=Count('id'),
        revenue=Sum('total_price'),
        profit=Sum('order_profit')
    ).order_by('month')

def get_customer_analytics():
    """
    Statistics per customer.
    """
    return Order.objects.values(
        'customer_name', 'customer_email'
    ).annotate(
        orders_count=Count('id'),
        total_spent=Sum('total_price')
    ).order_by('-total_spent')
