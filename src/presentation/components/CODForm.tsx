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
    const [confirmPhone, setConfirmPhone] = useState('');
    const [selectedWilayaId, setSelectedWilayaId] = useState<number | ''>(''); // Start with empty wilaya selection
    const [commune, setCommune] = useState('');
    const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSummary, setShowSummary] = useState(true);

    const activeWilaya = useMemo(() => 
        selectedWilayaId !== '' ? wilayas.find(w => w.id === selectedWilayaId) || null : null
    , [selectedWilayaId]);

    const communes = useMemo(() => 
        selectedWilayaId !== '' ? communesByWilaya[selectedWilayaId] || [] : []
    , [selectedWilayaId]);

    const deliveryFee = useMemo(() => 
        activeWilaya ? (deliveryType === 'home' ? activeWilaya.homeFee : activeWilaya.officeFee) : null
    , [activeWilaya, deliveryType]);

    const totalPrice = useMemo(() => 
        deliveryFee !== null ? (productPrice * quantity) + deliveryFee : null
    , [productPrice, quantity, deliveryFee]);

    const handleSubmit = async () => {
        if (!selectedSize) {
            alert('Veuillez sélectionner une pointure / الرجاء اختيار المقاس');
            return;
        }

        if (!customerName || !customerPhone || !confirmPhone || !commune || !activeWilaya) {
            alert('Veuillez remplir tous les champs / يرجى ملء كل الخانات');
            return;
        }

        if (customerPhone !== confirmPhone) {
            alert('Veuillez entrer le même numéro de téléphone pour le confirmer. / الرجاء إدخال نفس رقم الهاتف للتأكيد.');
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
                delivery_fee: deliveryFee || 0,
                delivery_type: deliveryType,
                total_price: totalPrice || (productPrice * quantity),
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
                    delivery_fee: deliveryFee || 0,
                    delivery_type: deliveryType,
                    total_price: totalPrice || (productPrice * quantity),
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
                setConfirmPhone('');
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
        <div className="cod-form-container" style={{
            border: '1.5px solid #27ae60',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#fff',
            margin: '30px auto 0 auto',
            maxWidth: '450px',
            width: '92%',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
        }}>
            {/* Inputs Grid */}
            <div className="cod-form-inputs-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '15px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Nom complet / الاسم الكامل"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', boxSizing: 'border-box', width: '100%', maxWidth: '100%' }}
                />
                <input
                    type="tel"
                    placeholder="Numéro de téléphone / رقم الهاتف"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box', width: '100%', maxWidth: '100%' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <input
                        type="tel"
                        placeholder="Confirmer votre numéro / تأكيد رقم الهاتف"
                        value={confirmPhone}
                        onChange={(e) => setConfirmPhone(e.target.value)}
                        style={{ 
                            padding: '12px', 
                            border: confirmPhone && customerPhone !== confirmPhone ? '1px solid #e74c3c' : '1px solid #ccc', 
                            borderRadius: '4px', 
                            fontSize: '13px', 
                            outline: 'none', 
                            backgroundColor: '#fff', 
                            boxSizing: 'border-box', 
                            width: '100%', 
                            maxWidth: '100%' 
                        }}
                    />
                    {confirmPhone && customerPhone !== confirmPhone && (
                        <span style={{ color: '#e74c3c', fontSize: '10px', marginTop: '4px', fontWeight: 600 }}>
                            Veuillez entrer le même numéro de téléphone pour le confirmer. / الرجاء إدخال نفس رقم الهاتف للتأكيد.
                        </span>
                    )}
                </div>
                <select
                    value={selectedWilayaId}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                            setSelectedWilayaId('');
                            setCommune('');
                            return;
                        }
                        const nextId = Number(val);
                        setSelectedWilayaId(nextId);
                        setCommune(''); // Reset commune when wilaya changes
                        const nextWilaya = wilayas.find(w => w.id === nextId);
                        if (nextWilaya && nextWilaya.officeFee === 0) {
                            setDeliveryType('home');
                        }
                    }}
                    style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', color: selectedWilayaId === '' ? '#888' : '#000', boxSizing: 'border-box', width: '100%', maxWidth: '100%' }}
                >
                    <option value="">Wilaya / الولاية</option>
                    {wilayas.map(w => (
                        <option key={w.id} value={w.id} style={{ color: '#000' }}>{w.id} {w.name} - {w.nameAr}</option>
                    ))}
                </select>
                <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', color: commune === '' ? '#888' : '#000', boxSizing: 'border-box', width: '100%', maxWidth: '100%' }}
                >
                    <option value="">Ville / البلدية</option>
                    {communes.map((c) => (
                        <option key={c.name} value={c.name} style={{ color: '#000' }}>{c.name} - {c.nameAr}</option>
                    ))}
                    {communes.length === 0 && selectedWilayaId !== '' && <option value="Autre" style={{ color: '#000' }}>Autre / أخرى</option>}
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
                    borderTop: '1.5px solid #e2f2e5', 
                    cursor: 'pointer',
                    color: '#27ae60'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="1.5">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Récapitulatif de la commande</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showSummary ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>

            {showSummary && (
                <div style={{ padding: '12px 0', borderTop: '1px dashed #ccc' }}>
                    {/* Row 1: Product Name & Quantity & Base Price */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '12px' }}>
                        <span style={{ fontWeight: 700, textTransform: 'uppercase', color: '#111', fontSize: '11px', letterSpacing: '0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                            {productName}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ backgroundColor: '#27ae60', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '10px' }}>x{quantity}</span>
                            <span style={{ fontWeight: 700, color: '#333' }}>
                                {activeWilaya ? `${(productPrice * quantity).toLocaleString()} DA` : 'DA'}
                            </span>
                        </div>
                    </div>

                    {/* Row 2: Type de livraison Selection */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '8px 0', borderTop: '1px dashed #eee', fontSize: '11px' }}>
                        <span style={{ color: '#555', fontWeight: 700, textTransform: 'uppercase' }}>Type de livraison</span>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: deliveryType === 'home' ? 700 : 400 }}>
                                <input 
                                    type="radio" 
                                    checked={deliveryType === 'home'} 
                                    onChange={() => setDeliveryType('home')} 
                                    style={{ accentColor: '#27ae60', cursor: 'pointer' }} 
                                />
                                Domicile
                            </label>
                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                cursor: (!activeWilaya || activeWilaya.officeFee === 0) ? 'not-allowed' : 'pointer', 
                                fontWeight: deliveryType === 'office' ? 700 : 400,
                                opacity: (!activeWilaya || activeWilaya.officeFee === 0) ? 0.4 : 1
                            }}>
                                <input 
                                    type="radio" 
                                    disabled={!activeWilaya || activeWilaya.officeFee === 0}
                                    checked={deliveryType === 'office' && activeWilaya !== null && activeWilaya.officeFee > 0} 
                                    onChange={() => { if (activeWilaya && activeWilaya.officeFee > 0) setDeliveryType('office'); }} 
                                    style={{ accentColor: '#27ae60', cursor: 'pointer' }} 
                                />
                                Bureau
                            </label>
                        </div>
                    </div>

                    {/* Row 3: Prix de livraison (separators are clean) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '8px 0', borderTop: '1px dashed #eee', fontSize: '11px' }}>
                        <span style={{ color: '#555', fontWeight: 700, textTransform: 'uppercase' }}>Prix de livraison</span>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, color: '#333' }}>
                                {deliveryFee !== null ? `${deliveryFee.toLocaleString()} DA` : 'Choisir Wilaya / الولاية'}
                            </span>
                            {activeWilaya && <span style={{ fontSize: '9px', color: '#888' }}>({activeWilaya.name})</span>}
                        </div>
                    </div>

                    {/* Row 4: Prix Total */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid #27ae60', paddingTop: '12px', marginTop: '4px', fontSize: '12px' }}>
                        <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prix Total</span>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#000' }}>
                            {totalPrice !== null ? `${totalPrice.toLocaleString()} DA` : 'DA'}
                        </span>
                    </div>
                </div>
            )}

            {/* Footer: Quantity + Confirm */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', height: '48px', width: '100%' }}>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ flex: 1, fontSize: '18px', fontWeight: 500, backgroundColor: '#fff', borderRight: '1px solid #ccc' }}>+</button>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px', backgroundColor: '#fff' }}>{quantity}</div>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ flex: 1, fontSize: '18px', fontWeight: 500, backgroundColor: '#fff', borderLeft: '1px solid #ccc' }}>-</button>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                        width: '100%',
                        height: '50px',
                        backgroundColor: '#27ae60',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    {isSubmitting ? 'CHARGEMENT...' : 'CLIQUEZ ICI POUR CONFIRMER'}
                </button>
            </div>
        </div>
    );
}
