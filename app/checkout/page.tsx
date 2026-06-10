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
    const [confirmPhone, setConfirmPhone] = useState('');
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

        if (customerPhone !== confirmPhone) {
            alert('Veuillez entrer le même numéro de téléphone pour le confirmer.');
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
        <div className="bg-[#f9fafb] min-h-screen py-12 md:py-20 text-black">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-widest mb-10 text-center">
                    Caisse
                </h1>
                
                <form onSubmit={handleSubmitOrder} className="bg-white p-6 md:p-10 border border-gray-200 rounded-lg shadow-sm space-y-10">
                    {/* Information Section */}
                    <section>
                        <h3 className="text-sm font-sans font-bold uppercase tracking-[2px] mb-6 border-b border-gray-200 pb-3">
                            Informations de livraison
                        </h3>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 block">
                                    Nom complet / الاسم الكامل
                                </label>
                                <input 
                                    required
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-white border border-gray-300 focus:border-black focus:outline-none px-4 py-3 text-xs tracking-wider transition-all rounded-md uppercase text-black" 
                                    placeholder="EX. MOHAMED AMINE"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 block">
                                    Téléphone / رقم الهاتف
                                </label>
                                <input 
                                    required
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full bg-white border border-gray-300 focus:border-black focus:outline-none px-4 py-3 text-xs tracking-wider transition-all rounded-md text-black" 
                                    placeholder="05 / 06 / 07 ..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 block">
                                    Confirmer votre numéro / تأكيد رقم الهاتف
                                </label>
                                <input 
                                    required
                                    type="tel"
                                    value={confirmPhone}
                                    onChange={(e) => setConfirmPhone(e.target.value)}
                                    className={`w-full bg-white border focus:outline-none px-4 py-3 text-xs tracking-wider transition-all rounded-md text-black ${
                                        confirmPhone && customerPhone !== confirmPhone 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:border-black'
                                    }`}
                                    placeholder="05 / 06 / 07 ..."
                                />
                                {confirmPhone && customerPhone !== confirmPhone && (
                                    <p className="text-[10px] text-red-500 font-semibold mt-1">
                                        Veuillez entrer le même numéro de téléphone pour le confirmer. / الرجاء إدخال نفس رقم الهاتف للتأكيد.
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 block">
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
                                    className="w-full bg-white border border-gray-300 focus:border-black focus:outline-none px-4 py-3 text-xs tracking-wider transition-all rounded-md cursor-pointer uppercase text-black"
                                >
                                    {wilayas.map(w => (
                                        <option key={w.id} value={w.id}>
                                            {w.id} {w.name} - {w.nameAr}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 block">
                                    Commune / البلدية
                                </label>
                                <select 
                                    required
                                    value={commune}
                                    onChange={(e) => setCommune(e.target.value)}
                                    disabled={loadingCommunes}
                                    className="w-full bg-white border border-gray-300 focus:border-black focus:outline-none px-4 py-3 text-xs tracking-wider transition-all rounded-md cursor-pointer uppercase text-black"
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

                    {/* Delivery Options Section */}
                    <section>
                        <h3 className="text-sm font-sans font-bold uppercase tracking-[2px] mb-6 border-b border-gray-200 pb-3">
                            Option de livraison
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Row 1, Col 1: Domicile Text Card */}
                            <div 
                                className={`p-5 border cursor-pointer flex justify-between items-start rounded-md transition-all ${
                                    deliveryType === 'home' ? 'border-[#27ae60] bg-[#f2f9fc]' : 'border-gray-200 bg-white'
                                }`} 
                                onClick={() => setDeliveryType('home')}
                            >
                                <div>
                                    <span className="font-bold text-xs block mb-1 text-black">DOMICILE / DOMICILE</span>
                                    <span className="text-[10px] text-gray-400 block mb-3 font-semibold">توصيل للمنزل</span>
                                    <span className="font-bold text-sm block text-black">{activeWilaya.homeFee.toLocaleString()} DA</span>
                                </div>
                                <input 
                                    type="radio" 
                                    checked={deliveryType === 'home'} 
                                    onChange={() => setDeliveryType('home')} 
                                    className="accent-[#27ae60] cursor-pointer mt-1" 
                                />
                            </div>

                            {/* Row 1, Col 2: Domicile Icon Card */}
                            <div 
                                className={`p-5 border cursor-pointer flex justify-between items-center rounded-md transition-all ${
                                    deliveryType === 'home' ? 'border-[#27ae60] bg-[#f2f9fc]' : 'border-gray-200 bg-white'
                                }`} 
                                onClick={() => setDeliveryType('home')}
                            >
                                <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={deliveryType === 'home' ? '#27ae60' : '#444'} strokeWidth="1.5">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </div>
                                <input 
                                    type="radio" 
                                    checked={deliveryType === 'home'} 
                                    onChange={() => setDeliveryType('home')} 
                                    className="accent-[#27ae60] cursor-pointer" 
                                />
                            </div>

                            {/* Row 2, Col 1: Bureau Text Card */}
                            <div 
                                className={`p-5 border flex justify-between items-start rounded-md transition-all ${
                                    activeWilaya.officeFee === 0 
                                        ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50' 
                                        : (deliveryType === 'office' ? 'border-[#27ae60] bg-[#f2f9fc] cursor-pointer' : 'border-gray-200 bg-white cursor-pointer')
                                }`} 
                                onClick={() => { if (activeWilaya.officeFee > 0) setDeliveryType('office'); }}
                            >
                                <div>
                                    <span className="font-bold text-xs block mb-1 text-black">BUREAU / STOPDESK</span>
                                    <span className="text-[10px] text-gray-400 block mb-3 font-semibold">توصيل للمكتب</span>
                                    <span className="font-bold text-sm block text-black">
                                        {activeWilaya.officeFee === 0 ? 'Non disponible' : `${activeWilaya.officeFee.toLocaleString()} DA`}
                                    </span>
                                </div>
                                <input 
                                    type="radio" 
                                    disabled={activeWilaya.officeFee === 0}
                                    checked={deliveryType === 'office' && activeWilaya.officeFee > 0} 
                                    onChange={() => { if (activeWilaya.officeFee > 0) setDeliveryType('office'); }} 
                                    className="accent-[#27ae60] cursor-pointer mt-1" 
                                />
                            </div>

                            {/* Row 2, Col 2: Bureau Icon Card */}
                            <div 
                                className={`p-5 border flex justify-between items-center rounded-md transition-all ${
                                    activeWilaya.officeFee === 0 
                                        ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50' 
                                        : (deliveryType === 'office' ? 'border-[#27ae60] bg-[#f2f9fc] cursor-pointer' : 'border-gray-200 bg-white cursor-pointer')
                                }`} 
                                onClick={() => { if (activeWilaya.officeFee > 0) setDeliveryType('office'); }}
                            >
                                <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={deliveryType === 'office' ? '#27ae60' : '#444'} strokeWidth="1.5">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </div>
                                <input 
                                    type="radio" 
                                    disabled={activeWilaya.officeFee === 0}
                                    checked={deliveryType === 'office' && activeWilaya.officeFee > 0} 
                                    onChange={() => { if (activeWilaya.officeFee > 0) setDeliveryType('office'); }} 
                                    className="accent-[#27ae60] cursor-pointer" 
                                />
                            </div>
                        </div>
                    </section>

                    {/* Order Summary Section */}
                    <section>
                        <h3 className="text-sm font-sans font-bold uppercase tracking-[2px] mb-6 border-b border-gray-200 pb-3">
                            Récapitulatif de la commande
                        </h3>
                        
                        <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-start text-xs border-b border-gray-100 pb-3">
                                    <div>
                                        <p className="font-sans font-bold uppercase tracking-wider text-black mb-1">
                                            {item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            Taille: {item.selectedSize}
                                        </p>
                                    </div>
                                    <span className="font-semibold text-black tracking-wider whitespace-nowrap ml-4">
                                        {(item.price * item.quantity).toLocaleString()} DA
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-gray-200 pt-5 mb-6 text-xs uppercase tracking-wider text-gray-500 font-sans font-bold">
                            <div className="flex justify-between">
                                <span>Sous-total</span>
                                <span className="text-black font-bold">{cartTotal.toLocaleString()} DA</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Expédition ({deliveryType === 'home' ? 'Domicile' : 'Bureau'})</span>
                                <span className="text-black font-bold">{deliveryFee.toLocaleString()} DA</span>
                            </div>
                        </div>

                        <div className="border-t-2 border-black pt-5 mb-8 flex justify-between items-end font-sans">
                            <span className="text-sm font-bold uppercase tracking-widest text-black">Total</span>
                            <span className="text-xl font-black text-black tracking-normal">
                                {finalTotal.toLocaleString()} DA
                            </span>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-black text-white w-full max-w-md py-4 font-sans font-bold uppercase tracking-[2px] hover:opacity-85 transition-opacity text-xs border-none rounded-md"
                            >
                                {isSubmitting ? 'CHARGEMENT...' : 'CONFIRMER LA COMMANDE'}
                            </button>
                        </div>
                    </section>
                </form>

                {/* Footer Links */}
                <div className="flex justify-center gap-8 mt-12 pb-8 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    <Link href="/track-order" className="hover:text-black transition-colors">Track Order</Link>
                    <Link href="/faq" className="hover:text-black transition-colors">Faq</Link>
                    <Link href="/store-policy" className="hover:text-black transition-colors">Store Policy</Link>
                </div>
            </div>
        </div>
    );
}
