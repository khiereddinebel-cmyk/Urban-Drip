'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

    return (
        <div className="bg-white min-h-screen text-black py-16 md:py-24 font-sans uppercase">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                
                {/* Header Success Banner */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-serif font-light tracking-widest text-black mb-3">
                        Merci. Votre commande a été reçue.
                    </h1>
                    <p className="text-xs text-gray-500 tracking-[1.5px] font-medium">
                        Un conseiller vous contactera sous peu pour confirmer votre livraison.
                    </p>
                </div>

                {/* Top Meta Details (Order Number, Date, Total) */}
                <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-150 py-6 mb-12 text-center text-xs tracking-wider">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-1">Numéro de Commande</p>
                        <p className="font-bold text-black font-serif text-sm">#{displayOrderNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-1">Date</p>
                        <p className="font-semibold text-black">{order ? order.date : new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-1">Statut</p>
                        <p className="font-bold text-black text-[11px] tracking-widest">EN ATTENTE</p>
                    </div>
                </div>

                {/* Section: Order Details */}
                <div className="space-y-10">
                    
                    {/* Itemised Products List */}
                    <div>
                        <h2 className="text-xs font-bold tracking-[2px] text-gray-400 border-b border-gray-100 pb-3 mb-6">
                            Détails de la commande
                        </h2>
                        
                        {order && order.items && order.items.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item, index) => {
                                    const imageUrl = getProductImageUrl(item.image);
                                    return (
                                        <div key={index} className="py-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center p-1">
                                                    <Image 
                                                        src={imageUrl} 
                                                        alt={item.name} 
                                                        fill 
                                                        className="object-contain p-1" 
                                                        unoptimized
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] font-bold text-black tracking-wider line-clamp-1">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[10px] text-gray-400 font-bold">
                                                        Taille: {item.selectedSize} &times; {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-black tracking-wider whitespace-nowrap">
                                                {(item.price * item.quantity).toLocaleString()} DA
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-4 italic">Informations produits indisponibles après rafraîchissement</p>
                        )}
                    </div>

                    {/* Customer & Shipping Details */}
                    {order && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                            {/* Billing/Customer details */}
                            <div>
                                <h3 className="text-[10px] font-bold tracking-[2px] text-gray-400 mb-4">
                                    Informations client
                                </h3>
                                <div className="text-xs text-black space-y-2 font-medium tracking-wider leading-relaxed">
                                    <p className="font-bold text-sm text-serif">{order.customer_name}</p>
                                    <p>Téléphone: {order.customer_phone}</p>
                                    <p>Email: {order.customer_email}</p>
                                </div>
                            </div>
                            
                            {/* Shipping details */}
                            <div>
                                <h3 className="text-[10px] font-bold tracking-[2px] text-gray-400 mb-4">
                                    Adresse de facturation / livraison
                                </h3>
                                <div className="text-xs text-black space-y-2 font-medium tracking-wider leading-relaxed">
                                    <p className="font-semibold text-serif">{order.shipping_address}</p>
                                    <p>Wilaya: {order.wilaya}</p>
                                    <p>Type: {order.delivery_type === 'home' ? 'Livraison à domicile' : 'Point de retrait Bureau'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Financial Summary */}
                    <div className="border-t-2 border-black pt-8 mt-10 space-y-3 font-sans text-xs tracking-wider text-gray-500">
                        <div className="flex justify-between">
                            <span>Sous-total</span>
                            <span className="text-black font-semibold">
                                {order ? (order.total_price - order.delivery_fee).toLocaleString() : 'N/A'} DA
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Frais de livraison</span>
                            <span className="text-black font-semibold">
                                {order ? order.delivery_fee.toLocaleString() : 'N/A'} DA
                            </span>
                        </div>
                        <div className="flex justify-between text-black font-bold text-sm pt-3 border-t border-gray-100 items-end">
                            <span className="uppercase tracking-widest font-black">Total</span>
                            <span className="text-2xl font-black tracking-normal">
                                {order ? order.total_price.toLocaleString() : 'N/A'} DA
                            </span>
                        </div>
                    </div>

                    {/* Return Action */}
                    <div className="text-center pt-12">
                        <Link 
                            href="/" 
                            className="inline-block bg-black text-white px-12 py-4 text-xs font-sans tracking-[2px] uppercase font-bold hover:opacity-85 transition-opacity"
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
