'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../src/shared/context/CartContext';
import { wilayas, Wilaya } from '../../src/shared/utils/wilayaData';

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
    const [orderDone, setOrderDone] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

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

    useEffect(() => {
        if (cart.length === 0 && !orderDone) {
            router.push('/cart');
        }
    }, [cart, orderDone, router]);

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
            setOrderNumber(result.order_number);
            setOrderDone(true);
            clearCart();
            
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderDone) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-32 px-4 max-w-2xl mx-auto text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-10 shadow-lg shadow-green-200">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-6 tracking-tight">Order Confirmed!</h1>
                <p className="text-sm font-bold text-gray-500 mb-4 tracking-widest uppercase">Thank you for shopping with Urban Drip.</p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-10 py-6 mb-12">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-gray-400">Order Number</p>
                   <p className="text-3xl font-black italic">#{orderNumber}</p>
                </div>
                <p className="text-sm text-gray-600 mb-10 leading-relaxed uppercase tracking-widest">
                    We'll call you shortly on <strong>{customerPhone}</strong> to confirm your delivery to <strong>{activeWilaya.name}</strong>.
                </p>
                <Link href="/" className="bg-black text-white px-12 py-5 font-black uppercase italic tracking-widest hover:opacity-90">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
            <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800 }} className="text-4xl md:text-6xl uppercase italic mb-16 tracking-tighter text-center">Checkout</h1>
            
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Information Section */}
                <div className="space-y-12">
                    <section>
                        <h3 className="text-xl font-black uppercase italic mb-8 border-b-4 border-black pb-4 tracking-tighter">Shipping Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name / الإسم الكامل</label>
                                <input 
                                    required
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:outline-none px-6 py-4 font-bold transition-all" 
                                    placeholder="Ex: Mohamed Amine"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone / رقم الهاتف</label>
                                <input 
                                    required
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:outline-none px-6 py-4 font-bold transition-all" 
                                    placeholder="05 / 06 / 07 ..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wilaya / الولاية</label>
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
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:outline-none px-6 py-4 font-bold transition-all cursor-pointer"
                                >
                                    {wilayas.map(w => <option key={w.id} value={w.id}>{w.id} {w.name} - {w.nameAr}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Commune / البلدية</label>
                                <select 
                                    required
                                    value={commune}
                                    onChange={(e) => setCommune(e.target.value)}
                                    disabled={loadingCommunes}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:outline-none px-6 py-4 font-bold transition-all cursor-pointer"
                                >
                                    <option value="">{loadingCommunes ? 'Chargement...' : 'Sélectionner / إختر'}</option>
                                    {apiCommunes.map((c: any) => (
                                        <option key={c.id} value={c.name}>{c.name} - {c.name_ar}</option>
                                    ))}
                                    {!loadingCommunes && apiCommunes.length === 0 && <option value="Autre">Autre / أخرى</option>}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-black uppercase italic mb-8 border-b-4 border-black pb-4 tracking-tighter">Delivery Option</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`flex flex-col p-6 cursor-pointer border-2 transition-all rounded-xl ${deliveryType === 'home' ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-black uppercase tracking-widest text-sm">Domicile / المنزل</span>
                                    <input type="radio" checked={deliveryType === 'home'} onChange={() => setDeliveryType('home')} className="accent-green-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase">توصيل للمنزل</span>
                                <span className="mt-4 font-black text-lg text-green-600">{activeWilaya.homeFee.toLocaleString()} DA</span>
                            </label>

                            <label className={`flex flex-col p-6 border-2 transition-all rounded-xl ${
                                activeWilaya.officeFee === 0 
                                    ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-100' 
                                    : (deliveryType === 'office' ? 'border-green-500 bg-green-50 cursor-pointer' : 'border-gray-100 bg-gray-50 cursor-pointer')
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-black uppercase tracking-widest text-sm">Bureau / المكتب</span>
                                    <input 
                                        type="radio" 
                                        disabled={activeWilaya.officeFee === 0}
                                        checked={deliveryType === 'office' && activeWilaya.officeFee > 0} 
                                        onChange={() => { if (activeWilaya.officeFee > 0) setDeliveryType('office'); }} 
                                        className="accent-green-500" 
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase">توصيل شركة التوصيل</span>
                                <span className="mt-4 font-black text-lg text-green-600">
                                    {activeWilaya.officeFee === 0 ? 'Non disponible / غير متوفر' : `${activeWilaya.officeFee.toLocaleString()} DA`}
                                </span>
                            </label>
                        </div>
                    </section>
                </div>

                {/* Right Bar - My Order */}
                <div className="lg:pl-16">
                    <div className="bg-gray-50 p-10 sticky top-32 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black uppercase italic mb-8 tracking-tighter">Order Summary</h3>
                        
                        <div className="max-h-96 overflow-y-auto mb-8 space-y-6 pr-4 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 items-center">
                                    <div className="relative w-16 h-16 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                                        <Image src={item.images[0]} alt={item.name} fill className="object-contain p-1" />
                                        <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black uppercase tracking-tight text-gray-900 mb-1">{item.name}</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Size {item.selectedSize}</p>
                                    </div>
                                    <span className="text-sm font-black italic">{(item.price * item.quantity).toLocaleString()} DA</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 border-t border-gray-200 pt-6 mb-8">
                            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-400">
                                <span>Subtotal</span>
                                <span className="text-black font-black">{cartTotal.toLocaleString()} DA</span>
                            </div>
                            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-400">
                                <span>Shipping ({deliveryType === 'home' ? 'Home' : 'Office'})</span>
                                <span className="text-black font-black">{deliveryFee.toLocaleString()} DA</span>
                            </div>
                        </div>

                        <div className="border-t-4 border-black pt-6 mb-10 flex justify-between items-end">
                            <span className="text-sm font-black uppercase italic tracking-widest">Total</span>
                            <span className="text-4xl font-black italic tracking-tighter text-black">{finalTotal.toLocaleString()} DA</span>
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 text-white w-full py-6 font-black uppercase tracking-widest hover:bg-green-700 transition-all text-base rounded-xl shadow-xl shadow-green-200"
                        >
                            {isSubmitting ? 'CHARGEMENT...' : 'CLIQUEZ ICI POUR CONFIRMER'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
