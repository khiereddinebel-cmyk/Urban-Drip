import { Order } from '../entities/Order';
import { OrderRepository } from '../repositories/OrderRepository';

export class CreateOrder {
    constructor(private orderRepository: OrderRepository) { }

    async execute(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
        // Validate order here before processing
        if (orderData.items.length === 0) {
            throw new Error('Order must contain at least one item');
        }
        return this.orderRepository.createOrder(orderData);
    }
}
