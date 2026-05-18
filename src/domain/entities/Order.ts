import { Product } from './Product';

export interface OrderItem {
    product: Product;
    quantity: number;
    selectedSize: number;
    selectedColor: string;
}

export interface Order {
    id: string;
    customerName: string;
    phone: string;
    wilaya: string; // Region/State in Algeria
    address: string;
    paymentMethod: 'Cash' | 'Baridiweb' | 'Visa';
    language: 'Arabic' | 'French' | 'English';
    items: OrderItem[];
    totalAmount: number;
    status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
}
