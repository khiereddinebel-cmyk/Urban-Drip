'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../src/shared/context/CartContext';
import { wilayas } from '../../src/shared/utils/wilayaData';
import { getProductImageUrl } from '../../src/shared/utils/imageUtils';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    
    // Form state
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedWilayaId, setSelectedWilayaId] = useState<number>(wilayas[15].id); // Default to Alger
    const [commune, setCommune] = useState('');
    const [apiCommunes, setApiCommunes] = useState<any[]>([]);
    const [loadingCommunes, setLoadingCommunes] = useState(false);
    const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activeWilaya = useMemo(() => 
        wilayas.find(w => w.id === selectedWilayaId) || wilayas[0]
    , [selectedWilayaId]);

    // Fetch communes from API when wilaya changes
    useEffect(() => {
        const fetchCommunes = async () => {
            setLoadingCommunes(true);
            try {
                const wilayaCode = selectedWilayaId.toString().padStart(2, '0');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/baladiyas/?wilaya_code=${wilayaCode}`);
                if (response.ok) {
                    const data = await response.json();
                    setApiCommunes(data);
                }
            } catch (error) {
                console.error("Failed to fetch communes:", error);
            } finally {
                setLoadingCommunes(false);
            }
        };
        fetchCommunes();
    }, [selectedWilayaId]);

    const deliveryFee = deliveryType === 'home' ? activeWilaya.homeFee : activeWilaya.officeFee;
    const finalTotal = cartTotal + deliveryFee;

    // Redirect empty cart
    useEffect(() => {
        if (cart.length === 0) {
            router.push('/cart');
        }
    }, [cart, router]);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!customerName || !customerPhone || !commune) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: 'customer@urbandrip.com',
                shipping_address: `${activeWilaya.name} (${activeWilaya.nameAr}), ${commune} - ${deliveryType === 'home' ? 'Domicile' : 'Bureau/StopDesk'}`,
                wilaya: activeWilaya.name,
                baladiya: commune,
                delivery_fee: deliveryFee,
                delivery_type: deliveryType,
                total_price: finalTotal,
                payment_status: 'Unpaid',
                items: cart.map(item => ({
                    product: parseInt(item.id),
                    quantity: item.quantity,
                    price: item.price,
                    size: String(item.selectedSize)
                }))
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/orders/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) throw new Error('Order submission failed');

            const result = await response.json();
            
            // Format order summary details for the dedicated success page
            const completedOrder = {
                order_number: result.order_number,
                date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                status: 'En cours de traitement',
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: 'customer@urbandrip.com',
                shipping_address: `${activeWilaya.name} (${activeWilaya.nameAr}), ${commune} - ${deliveryType === 'home' ? 'Domicile' : 'Bureau/StopDesk'}`,
                wilaya: activeWilaya.name,
                baladiya: commune,
                delivery_fee: deliveryFee,
                delivery_type: deliveryType,
                total_price: finalTotal,
                items: cart.map(item => ({
                    name: item.name,
                    image: item.images?.[0] || '',
                    quantity: item.quantity,
                    price: item.price,
                    selectedSize: String(item.selectedSize)
                }))
            };

            sessionStorage.setItem('last_completed_order', JSON.stringify(completedOrder));
            clearCart();
            router.push(`/checkout/success?order_number=${result.order_number}`);
            
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-black">
            <h1 className="text-3xl md:text-5xl font-serif font-light uppercase tracking-widest mb-16 text-center">
                Caisse
            </h1>
            
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Information Section */}
                <div className="space-y-12">
                    <section>
                        <h3 className="text-sm font-sans font-bold uppercase tracking-[2px] mb-8 border-b border-gray-100 pb-4">
                            Informations de livraison
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">
                                    Nom Complet / الإسم الكامل
                                </label>
                                <input 
                                    required
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-black focus:outline-none px-4 py-3 text-xs tracking-wider transition-all rounded-none uppercase text-black" 
                                    placeholder="Ex: Mohamed Amine"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">
                                    Téléphone / رقم الهاتف
                                </label>
                                <input 
                                    required
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-black focus:outline-none px-4 py-3 text-xs tracking-wider transition-all rounded-none text-black" 
                                    placeholder="05 / 06 / 07 ..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">
                                    Wilaya / الولاية
                                </label>
                                <select 
                                    value={selectedWilayaId}
                                    onChange={(e) => {
                                        const nextId = Number(e.target.value);
                                        setSelectedWilayaId(nextId);
                                        setCommune('');
                                        const nextWilaya = wilayas.find(w => w.id === nextId);
                                        if (nextWilaya && nextWilaya.officeFee === 0) {
                                            setDeliveryType('home');
                                        }
                                    }}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-black focus:outline-none px-4 py-3 text-xs tracking-wider transition-all rounded-none cursor-pointer uppercase text-black"
                                >
                                    {wilayas.map(w => (
                                        <option key={w.id} value={w.id}>
                                            {w.id} {w.name} - {w.nameAr}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">
                                    Commune / البلدية
                                </label>
                                <select 
                                    required
                                    value={commune}
                                    onChange={(e) => setCommune(e.target.value)}
                                    disabled={loadingCommunes}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-black focus:outline-none px-4 py-3 text-xs tracking-wider transition-all rounded-none cursor-pointer uppercase text-black"
                                >
                                    <option value="">
                                        {loadingCommunes ? 'CHARGEMENT...' : 'SELECTIONNER / إختر'}
                                    </option>
                                    {apiCommunes.map((c: any) => (
                                        <option key={c.id} value={c.name}>
                                            {c.name} - {c.name_ar}
                                        </option>
                                    ))}
                                    {!loadingCommunes && apiCommunes.length === 0 && (
                                        <option value="Autre">Autre / أخرى</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-sans font-bold uppercase tracking-[2px] mb-8 border-b border-gray-100 pb-4">
                            Option de livraison
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className={`flex flex-col p-6 cursor-pointer border transition-all rounded-none ${
                                deliveryType === 'home' ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-sans font-bold uppercase tracking-widest text-xs">
                                        Domicile / Domicile
                                    </span>
                                    <input 
                                        type="radio" 
                                        checked={deliveryType === 'home'} 
                                        onChange={() => setDeliveryType('home')} 
                                        className="accent-black" 
                                    />
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                    توصيل للمنزل
                                </span>
                                <span className="mt-4 font-sans font-bold text-base text-black">
                                    {activeWilaya.homeFee.toLocaleString()} DA
                                </span>
                            </label>

                            <label className={`flex flex-col p-6 border transition-all rounded-none ${
                                activeWilaya.officeFee === 0 
                                    ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50' 
                                    : (deliveryType === 'office' ? 'border-black bg-gray-50 cursor-pointer' : 'border-gray-200 bg-white cursor-pointer')
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-sans font-bold uppercase tracking-widest text-xs">
                                        Bureau / StopDesk
                                    </span>
                                    <input 
                                        type="radio" 
                                        disabled={activeWilaya.officeFee === 0}
                                        checked={deliveryType === 'office' && activeWilaya.officeFee > 0} 
                                        onChange={() => { if (activeWilaya.officeFee > 0) setDeliveryType('office'); }} 
                                        className="accent-black" 
                                    />
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                    توصيل للمكتب
                                </span>
                                <span className="mt-4 font-sans font-bold text-base text-black">
                                    {activeWilaya.officeFee === 0 ? 'Non disponible' : `${activeWilaya.officeFee.toLocaleString()} DA`}
                                </span>
                            </label>
                        </div>
                    </section>
                </div>

                {/* Right Bar - My Order */}
                <div className="lg:pl-12">
                    <div className="bg-gray-50 p-8 md:p-10 sticky top-32 border border-gray-100">
                        <h3 className="text-sm font-sans font-bold uppercase tracking-[2px] mb-8 border-b border-gray-200 pb-4">
                            Récapitulatif de la commande
                        </h3>
                        
                        <div className="max-h-96 overflow-y-auto mb-8 space-y-6 pr-4 divide-y divide-gray-100">
                            {cart.map((item, index) => {
                                const imageUrl = getProductImageUrl(item.images?.[0]);
                                return (
                                    <div key={`${item.id}-${item.selectedSize}`} className={`flex gap-4 items-center ${index > 0 ? 'pt-4' : ''}`}>
                                        <div className="relative w-16 h-16 bg-white border border-gray-200 p-1 shrink-0 flex items-center justify-center">
                                            <Image 
                                                src={imageUrl} 
                                                alt={item.name} 
                                                fill 
                                                className="object-contain p-1" 
                                                unoptimized
                                            />
                                            <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-sans font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-black truncate mb-1">
                                                {item.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                Taille: {item.selectedSize}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold text-black tracking-wider whitespace-nowrap">
                                            {(item.price * item.quantity).toLocaleString()} DA
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-4 border-t border-gray-200 pt-6 mb-6 text-xs uppercase tracking-wider text-gray-500 font-sans">
                            <div className="flex justify-between">
                                <span>Sous-total</span>
                                <span className="text-black font-semibold">{cartTotal.toLocaleString()} DA</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Expédition ({deliveryType === 'home' ? 'Domicile' : 'Bureau'})</span>
                                <span className="text-black font-semibold">{deliveryFee.toLocaleString()} DA</span>
                            </div>
                        </div>

                        <div className="border-t-2 border-black pt-6 mb-10 flex justify-between items-end font-sans">
                            <span className="text-sm font-bold uppercase tracking-widest text-black">Total</span>
                            <span className="text-2xl font-black text-black tracking-normal">
                                {finalTotal.toLocaleString()} DA
                            </span>
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black text-white w-full py-4 font-sans font-bold uppercase tracking-[2px] hover:opacity-85 transition-opacity text-xs border-none rounded-none"
                        >
                            {isSubmitting ? 'CHARGEMENT...' : 'CONFIRMER LA COMMANDE'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
