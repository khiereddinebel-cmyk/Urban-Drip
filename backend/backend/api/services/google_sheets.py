import gspread
from google.oauth2.service_account import Credentials
from django.conf import settings
import os

# Connect to a sheet named "Urban Drip Orders"
SHEET_NAME = "Urban Drip Orders"

def _get_worksheet():
    """Helper to get or create the worksheet using Service Account credentials."""
    creds_path = os.path.join(settings.BASE_DIR, 'credentials.json')
    if not os.path.exists(creds_path):
        return None, "credentials.json not found in backend root."

    # Scopes for Sheets and Drive API
    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]
    
    try:
        creds = Credentials.from_service_account_file(creds_path, scopes=scopes)
        client = gspread.authorize(creds)
        
        try:
            sh = client.open(SHEET_NAME)
        except gspread.exceptions.SpreadsheetNotFound:
            sh = client.create(SHEET_NAME)
            # IMPORTANT: You must share the sheet with your email manually or via code
            # sh.share('your-email@gmail.com', perm_type='user', role='writer')
        
        return sh.get_worksheet(0), None
    except Exception as e:
        return None, str(e)

def append_order_to_sheets(order):
    """
    Appends a new row when an order is created with:
    Order ID, Customer Name, Phone, Address, Products, Total Price, Status
    """
    worksheet, error = _get_worksheet()
    if error:
        print(f"Google Sheets Sync Failed: {error}")
        return False
        
    try:
        # Check if header exists, if not create it precisely as requested
        if not worksheet.get_all_values():
            headers = ["Order ID", "Customer Name", "Phone", "Address", "Products", "Total Price", "Status"]
            worksheet.append_row(headers)

        # Format products as a clean string list
        products_list = ", ".join([
            f"{item.product.name if item.product else 'N/A'} (x{item.quantity})" 
            for item in order.items.all()
        ])
        
        # Data row matching the requested columns
        row = [
            order.order_number,
            order.customer_name,
            order.customer_phone,
            order.shipping_address,
            products_list,
            float(order.total_price),
            "NEW"
        ]
        
        worksheet.append_row(row)
        return True
    except Exception as e:
        print(f"Google Sheets Append Error: {e}")
        return False

def export_orders_to_sheets(orders):
    """Bulk export logic for the manual admin action."""
    worksheet, error = _get_worksheet()
    if error:
        return False, error

    try:
        headers = ["Order ID", "Customer Name", "Phone", "Address", "Products", "Total Price", "Status"]
        all_data = []
        
        if not worksheet.get_all_values():
             all_data.append(headers)

        for order in orders:
            products_list = ", ".join([
                f"{item.product.name if item.product else 'N/A'} (x{item.quantity})" 
                for item in order.items.all()
            ])
            all_data.append([
                order.order_number,
                order.customer_name,
                order.customer_phone,
                order.shipping_address,
                products_list,
                float(order.total_price),
                order.status
            ])

        if all_data:
            worksheet.append_rows(all_data)
        return True, f"Successfully synced {len(orders)} orders."
    except Exception as e:
        return False, str(e)
