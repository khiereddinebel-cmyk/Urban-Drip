import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, productName, size, quantity, total, paymentMethod } = body;

        // Simulate pushing to Firebase / admin notification
        console.log('[ADMIN NOTIFICATION] New order received!');

        // Simulate sending data to ZR Livraison API
        console.log('[ZR LIVRAISON API] Order dispatched:', {
            orderId: `ORD-${Date.now()}`,
            productName,
            size,
            quantity,
            total,
            paymentMethod,
            shippingStatus: 'PENDING'
        });

        return NextResponse.json(
            { success: true, message: 'Order created and sent to ZR Livraison.' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to process order.' },
            { status: 500 }
        );
    }
}
