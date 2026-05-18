import { Order } from '../entities/Order';

export interface OrderRepository {
    createOrder(order: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order>;
    confirmOrder(orderId: string): Promise<void>;
    updateOrderStatus(orderId: string, status: Order['status']): Promise<void>;
    getOrders(): Promise<Order[]>; // Admin
    getOrderById(id: string): Promise<Order | null>;
}
