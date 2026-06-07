'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { wilayas } from '../../shared/utils/wilayaData';
import { communesByWilaya } from '../../shared/utils/communeData';

interface CODFormProps {
    productId: string;
    productName: string;
    productPrice: number;
    selectedSize: number | string | null;
    productImage?: string;
}

export default function CODForm({ productId, productName, productPrice, selectedSize, productImage = "" }: CODFormProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedWilayaId, setSelectedWilayaId] = useState<number>(wilayas[15].id); // Default to Alger
    const [commune, setCommune] = useState('');
    const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSummary, setShowSummary] = useState(true);

    const activeWilaya = useMemo(() => 
        wilayas.find(w => w.id === selectedWilayaId) || wilayas[0]
    , [selectedWilayaId]);

    const communes = useMemo(() => 
        communesByWilaya[selectedWilayaId] || []
    , [selectedWilayaId]);

    const deliveryFee = deliveryType === 'home' ? activeWilaya.homeFee : activeWilaya.officeFee;
    const totalPrice = (productPrice * quantity) + deliveryFee;

    const handleSubmit = async () => {
        if (!selectedSize) {
            alert('Veuillez sélectionner une pointure / الرجاء اختيار المقاس');
            return;
        }

        if (!customerName || !customerPhone || !commune) {
            alert('Veuillez remplir tous les champs / يergى ملء كل الخانات');
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
                total_price: totalPrice,
                payment_status: 'Unpaid',
                items: [
                    {
                        product: parseInt(productId),
                        quantity: quantity,
                        size: String(selectedSize),
                        price: productPrice,
                    }
                ]
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/orders/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok || (result && result.success === false)) {
                const errMsg = (result && result.error) || 'Une erreur est survenue. Veuillez réessayer.';
                alert(`Erreur: ${errMsg}`);
                return;
            }

            if (result && result.order_number) {
                // Save order details to sessionStorage for the success page
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
                    total_price: totalPrice,
                    items: [
                        {
                            name: productName,
                            image: productImage,
                            quantity: quantity,
                            price: productPrice,
                            selectedSize: String(selectedSize)
                        }
                    ]
                };

                sessionStorage.setItem('last_completed_order', JSON.stringify(completedOrder));
                
                // Clear state
                setCustomerName('');
                setCustomerPhone('');
                setCommune('');

                // Redirect to success page
                router.push(`/checkout/success?order_number=${result.order_number}`);
            } else {
                throw new Error('La réponse du serveur ne contient pas de numéro de commande');
            }
        } catch (error: any) {
            console.error('Order error:', error);
            alert(`Une erreur est survenue: ${error.message || error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            border: '1px solid #111',
            borderRadius: '0px',
            padding: '24px',
            backgroundColor: '#fff',
            marginTop: '30px',
            fontFamily: 'inherit',
        }}>
            {/* Inputs Grid */}
            <div className="cod-form-inputs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Nom Complet / الإسم الكامل"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '0px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                />
                <input
                    type="tel"
                    placeholder="Téléphone / رقم الهاتف"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '0px', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                />
                <select
                    value={selectedWilayaId}
                    onChange={(e) => {
                        const nextId = Number(e.target.value);
                        setSelectedWilayaId(nextId);
                        setCommune(''); // Reset commune when wilaya changes
                        const nextWilaya = wilayas.find(w => w.id === nextId);
                        if (nextWilaya && nextWilaya.officeFee === 0) {
                            setDeliveryType('home');
                        }
                    }}
                    style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '0px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                    {wilayas.map(w => (
                        <option key={w.id} value={w.id}>{w.id} {w.name} - {w.nameAr}</option>
                    ))}
                </select>
                <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '0px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                    <option value="">Commune / البلدية</option>
                    {communes.map((c) => (
                        <option key={c.name} value={c.name}>{c.name} - {c.nameAr}</option>
                    ))}
                    {communes.length === 0 && <option value="Autre">Autre / أخرى</option>}
                </select>
            </div>

            {/* Accordion Toggle */}
            <div 
                onClick={() => setShowSummary(!showSummary)}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px 0', 
                    borderTop: '1px solid #eee', 
                    cursor: 'pointer',
                    color: '#111'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Récapitulatif</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showSummary ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>

            {showSummary && (
                <div style={{ padding: '12px 0', borderTop: '1px dotted #ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ fontWeight: 700, textTransform: 'uppercase', color: '#111', fontSize: '11px', letterSpacing: '0.5px' }}>{productName}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}>
                            <span style={{ backgroundColor: '#000', color: '#fff', padding: '1px 5px', borderRadius: '0px', fontWeight: 700 }}>x{quantity}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ color: '#555', display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Type de livraison</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: deliveryType === 'home' ? 700 : 400 }}>
                                    <input type="radio" checked={deliveryType === 'home'} onChange={() => setDeliveryType('home')} style={{ accentColor: '#000' }} />
                                    Domicile (Home)
                                </label>
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    cursor: activeWilaya.officeFee === 0 ? 'not-allowed' : 'pointer', 
                                    fontWeight: deliveryType === 'office' ? 700 : 400,
                                    opacity: activeWilaya.officeFee === 0 ? 0.4 : 1
                                }}>
                                    <input 
                                        type="radio" 
                                        disabled={activeWilaya.officeFee === 0}
                                        checked={deliveryType === 'office' && activeWilaya.officeFee > 0} 
                                        onChange={() => { if (activeWilaya.officeFee > 0) setDeliveryType('office'); }} 
                                        style={{ accentColor: '#000' }} 
                                    />
                                    Bureau / StopDesk {activeWilaya.officeFee === 0 && '(Non disp)'}
                                </label>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '11px' }}>
                            <span style={{ color: '#888' }}>{activeWilaya.name}</span>
                            <span style={{ fontWeight: 700, color: '#000' }}>{deliveryFee.toLocaleString()} DA</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #111', paddingTop: '12px', marginTop: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Prix Total</span>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#000' }}>{totalPrice.toLocaleString()} DA</span>
                    </div>
                </div>
            )}

            {/* Footer: Quantity + Confirm */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '0px', overflow: 'hidden' }}>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0 10px', fontSize: '14px', fontWeight: 600 }}>+</button>
                    <div style={{ padding: '8px 12px', backgroundColor: '#f9f9f9', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', fontWeight: 700, minWidth: '35px', textAlign: 'center', fontSize: '13px' }}>{quantity}</div>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0 10px', fontSize: '14px', fontWeight: 600 }}>-</button>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                        flex: 1,
                        backgroundColor: isSubmitting ? '#999' : '#000',
                        color: '#fff',
                        borderRadius: '0px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {isSubmitting ? 'CHARGEMENT...' : 'CONFIRMER LA COMMANDE'}
                </button>
            </div>
        </div>
    );
}
