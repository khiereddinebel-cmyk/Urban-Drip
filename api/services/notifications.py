import logging
import requests
import os

logger = logging.getLogger(__name__)

def send_order_notifications(order):
    """
    Sends order details to the admin via Telegram and Email.
    This function is wrapped in try-except blocks to prevent external API failures
    from interrupting checkout/order creation.
    """
    try:
        # 1. Format order details
        items_summary = "\n".join([
            f"• {item.quantity}x {item.product.name if item.product else 'Unknown'} (Size: {item.size or 'N/A'})"
            for item in order.items.all()
        ])
        
        message = (
            f"🚨 *NEW ORDER PLACED!* 🚨\n\n"
            f"📦 *Order Number:* `{order.order_number}`\n"
            f"👤 *Customer:* {order.customer_name}\n"
            f"📞 *Phone:* {order.customer_phone}\n"
            f"📍 *Location:* {order.wilaya or 'N/A'}, {order.baladiya or 'N/A'}\n"
            f"🏠 *Address:* {order.shipping_address}\n"
            f"🚚 *Delivery:* {order.delivery_type.upper()}\n"
            f"💵 *Total Price:* {order.total_price} DA (Delivery Fee: {order.delivery_fee} DA)\n\n"
            f"🛒 *Items Ordered:*\n{items_summary}\n\n"
            f"🕒 *Time:* {order.created_at.strftime('%Y-%m-%d %H:%M:%S') if order.created_at else 'Just now'}"
        )
        
        # 2. Telegram Notification
        bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        chat_id = os.getenv("TELEGRAM_CHAT_ID")
        if bot_token and chat_id:
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": message,
                "parse_mode": "Markdown"
            }
            try:
                res = requests.post(url, json=payload, timeout=8)
                if res.ok:
                    logger.info(f"Telegram notification sent for Order {order.order_number}")
                else:
                    logger.error(f"Telegram API error ({res.status_code}): {res.text}")
            except Exception as tg_err:
                logger.error(f"Failed connecting to Telegram API: {tg_err}")
        else:
            logger.info("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured")

        # 3. Email Notification
        admin_email = os.getenv("ADMIN_EMAIL")
        if admin_email:
            try:
                from django.core.mail import send_mail
                subject = f"[Urban Drip] New Order #{order.order_number}"
                email_body = (
                    f"New order received on Urban Drip:\n\n"
                    f"Order Number: {order.order_number}\n"
                    f"Customer Name: {order.customer_name}\n"
                    f"Phone Number: {order.customer_phone}\n"
                    f"Location: {order.wilaya}, {order.baladiya}\n"
                    f"Shipping Address: {order.shipping_address}\n"
                    f"Delivery Type: {order.delivery_type}\n"
                    f"Total Price: {order.total_price} DA\n\n"
                    f"Items:\n{items_summary}\n"
                )
                send_mail(
                    subject,
                    email_body,
                    'noreply@urbandripdz.com',
                    [admin_email],
                    fail_silently=True
                )
                logger.info(f"Email notification sent to {admin_email} for Order {order.order_number}")
            except Exception as email_err:
                logger.error(f"Failed sending email notification: {email_err}")
                
    except Exception as e:
        logger.exception(f"Unexpected error in send_order_notifications: {e}")
