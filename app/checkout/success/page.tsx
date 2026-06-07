'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProductImageUrl } from '../../../src/shared/utils/imageUtils';

interface OrderItem {
    name: string;
    image: string;
    quantity: number;
    price: number;
    selectedSize: string;
}

interface CompletedOrder {
    order_number: string;
    date: string;
    status: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    shipping_address: string;
    wilaya: string;
    commune: string;
    delivery_fee: number;
    delivery_type: string;
    total_price: number;
    items: OrderItem[];
}

function SuccessPageContent() {
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<CompletedOrder | null>(null);
    const orderNumberFromUrl = searchParams.get('order_number') || '';

    useEffect(() => {
        const storedOrder = sessionStorage.getItem('last_completed_order');
        if (storedOrder) {
            try {
                const parsed = JSON.parse(storedOrder) as CompletedOrder;
                if (parsed.order_number === orderNumberFromUrl || !orderNumberFromUrl) {
                    setOrder(parsed);
                }
            } catch (err) {
                console.error("Failed to parse stored order:", err);
            }
        }
    }, [orderNumberFromUrl]);

    const displayOrderNumber = orderNumberFromUrl || (order ? order.order_number : '');
    const displayDate = order ? order.date : new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const displayTotal = order ? order.total_price : 0;
    const subtotal = order ? (order.total_price - order.delivery_fee) : 0;

    return (
        <div className="bg-white min-h-screen text-black py-16 md:py-24 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                {/* 1. Green Dashed Banner Box */}
                <div 
                    className="border-2 border-dashed border-[#7a9c59] p-6 text-center text-[#7a9c59] text-[16px] md:text-[18px] font-sans font-medium mb-12 max-w-2xl mx-auto"
                    style={{ borderRadius: '4px' }}
                >
                    Merci. Votre commande a été reçue.
                </div>

                {/* 2. Top Summary Meta Data Grid */}
                <div className="flex justify-center mb-16">
                    <div className="grid grid-cols-3 gap-0 border-r border-l border-gray-150 py-2 text-center max-w-xl w-full">
                        <div className="px-4 border-r border-gray-150">
                            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2">Numéro de commande :</p>
                            <p className="font-bold text-black text-[13px] md:text-[14px]">{displayOrderNumber || 'N/A'}</p>
                        </div>
                        <div className="px-4 border-r border-gray-150">
                            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2">Date :</p>
                            <p className="font-bold text-black text-[13px] md:text-[14px]">{displayDate}</p>
                        </div>
                        <div className="px-4">
                            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2">Total :</p>
                            <p className="font-bold text-black text-[13px] md:text-[14px]">{displayTotal.toLocaleString()} DA</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* 3. Section: Order Details */}
                    <div className="mb-16">
                        <h2 className="text-[20px] md:text-[24px] font-bold font-serif mb-6 text-black border-none">
                            Détails De La Commande
                        </h2>
                        
                        <div className="w-full text-xs md:text-sm">
                            {/* Table Header */}
                            <div className="flex justify-between font-bold text-black border-b border-gray-200 pb-3 mb-4 tracking-wider">
                                <span>PRODUIT</span>
                                <span>TOTAL</span>
                            </div>

                            {/* Items List */}
                            {order && order.items && order.items.length > 0 ? (
                                <div className="divide-y divide-gray-100 border-b border-gray-200">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="py-4 flex justify-between items-center text-gray-800">
                                            <span>
                                                {item.name} - {item.selectedSize} <span className="font-medium text-black">× {item.quantity}</span>
                                            </span>
                                            <span className="font-bold text-black whitespace-nowrap">
                                                {(item.price * item.quantity).toLocaleString()} DA
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-4 border-b border-gray-200 text-gray-400 italic">
                                    Informations produits indisponibles après rafraîchissement
                                </div>
                            )}

                            {/* Subtotal */}
                            <div className="flex justify-between py-4 border-b border-gray-150 text-gray-800">
                                <span className="font-bold">Sous-total :</span>
                                <span className="font-bold text-black">{subtotal.toLocaleString()} DA</span>
                            </div>

                            {/* Shipping */}
                            <div className="flex justify-between py-4 border-b border-gray-150 text-gray-800">
                                <span className="font-bold">Expédition :</span>
                                <span className="font-bold text-[#7a9c59]">
                                    {order ? `${order.delivery_fee.toLocaleString()} DA via ${order.delivery_type === 'home' ? 'التوصيل للمنزل' : 'Bureau/StopDesk'}` : 'N/A'}
                                </span>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between py-5 text-black text-sm md:text-base">
                                <span className="font-bold">Total :</span>
                                <span className="font-bold">{displayTotal.toLocaleString()} DA</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Section: Billing Address */}
                    {order && (
                        <div className="mb-16">
                            <h2 className="text-[20px] md:text-[24px] font-bold font-serif mb-6 text-black border-none">
                                Adresse De Facturation
                            </h2>
                            <div className="text-xs md:text-sm text-gray-600 space-y-1.5 leading-relaxed font-serif italic">
                                <p className="not-italic text-black font-semibold">{order.customer_name}</p>
                                <p>{order.commune}</p>
                                <p>{order.wilaya}</p>
                                <p className="not-italic text-black">{order.customer_phone}</p>
                            </div>
                        </div>
                    )}

                    {/* Return Action Button */}
                    <div className="text-center pt-8 border-t border-gray-100">
                        <Link 
                            href="/" 
                            className="inline-block bg-black text-white px-10 py-3.5 text-xs font-sans tracking-[2px] uppercase font-bold hover:opacity-85 transition-opacity"
                            style={{ borderRadius: '0px' }}
                        >
                            Retour à la boutique
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-sans tracking-[2px] text-xs uppercase text-gray-400">Chargement...</div>}>
            <SuccessPageContent />
        </Suspense>
    );
}
