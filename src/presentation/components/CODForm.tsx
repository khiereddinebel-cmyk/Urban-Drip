'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { wilayas } from '../../shared/utils/wilayaData';

interface CODFormProps {
    productId: string;
    productName: string;
    productPrice: number;
    selectedSize: number | string | null;
}

export default function CODForm({ productId, productName, productPrice, selectedSize }: CODFormProps) {
    const [quantity, setQuantity] = useState(1);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedWilayaId, setSelectedWilayaId] = useState<number>(wilayas[15].id); // Default to Alger
    const [commune, setCommune] = useState('');
    const [apiCommunes, setApiCommunes] = useState<any[]>([]);
    const [loadingCommunes, setLoadingCommunes] = useState(false);
    const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSummary, setShowSummary] = useState(true);

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
    const totalPrice = (productPrice * quantity) + deliveryFee;

    const handleSubmit = async () => {
        if (!selectedSize) {
            alert('Veuillez sélectionner une pointure / الرجاء اختيار المقاس');
            return;
        }

        if (!customerName || !customerPhone || !commune) {
            alert('Veuillez remplir tous les champs / يرجى ملء كل الخانات');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: 'customer@urbandrip.com',
                shipping_address: `${activeWilaya.name} (${activeWilaya.nameAr}), ${commune} - ${deliveryType === 'home' ? 'Domicile' : 'Bureau/StopDesk'}`,
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

            if (!response.ok) throw new Error('Order submission failed');

            const result = await response.json();
            alert(`Commande confirmée ! / تم تأكيد الطلب\n#${result.order_number}`);
            
            setCustomerName('');
            setCustomerPhone('');
            setCommune('');
        } catch (error) {
            console.error('Order error:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            border: '2px solid #27ae60',
            borderRadius: '12px',
            padding: '30px',
            backgroundColor: '#fff',
            marginTop: '30px',
            fontFamily: 'inherit',
            boxShadow: '0 10px 40px rgba(39, 174, 96, 0.08)'
        }}>
            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <input
                    type="text"
                    placeholder="Nom Complet / الإسم الكامل"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ padding: '15px', border: '1.5px solid #eee', borderRadius: '8px', fontSize: '15px', outline: 'none', backgroundColor: '#fcfcfc' }}
                />
                <input
                    type="tel"
                    placeholder="Téléphone / رقم الهاتف"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ padding: '15px', border: '1.5px solid #eee', borderRadius: '8px', fontSize: '15px', outline: 'none', backgroundColor: '#fcfcfc' }}
                />
                <select
                    value={selectedWilayaId}
                    onChange={(e) => {
                        setSelectedWilayaId(Number(e.target.value));
                        setCommune(''); // Reset commune when wilaya changes
                    }}
                    style={{ padding: '15px', border: '1.5px solid #eee', borderRadius: '8px', fontSize: '15px', outline: 'none', backgroundColor: '#fcfcfc' }}
                >
                    {wilayas.map(w => (
                        <option key={w.id} value={w.id}>{w.id} {w.name} - {w.nameAr}</option>
                    ))}
                </select>
                <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    disabled={loadingCommunes}
                    style={{ padding: '15px', border: '1.5px solid #eee', borderRadius: '8px', fontSize: '15px', outline: 'none', backgroundColor: '#fcfcfc' }}
                >
                    <option value="">{loadingCommunes ? 'Chargement...' : 'Commune / البلدية'}</option>
                    {apiCommunes.map((c: any) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    {!loadingCommunes && apiCommunes.length === 0 && <option value="Autre">Autre / أخرى</option>}
                </select>
            </div>

            {/* Accordion Toggle */}
            <div 
                onClick={() => setShowSummary(!showSummary)}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '15px 0', 
                    borderTop: '1px solid #f0f0f0', 
                    cursor: 'pointer',
                    color: '#444'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="1.5">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>Récapitulatif de la commande</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showSummary ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>

            {showSummary && (
                <div style={{ padding: '15px 0', borderTop: '1px dotted #ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ fontWeight: 800, textTransform: 'uppercase', color: '#333' }}>{productName}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ backgroundColor: '#27ae60', color: '#fff', fontSize: '11px', padding: '2px 6px', borderRadius: '3px', fontWeight: 800 }}>x{quantity}</span>
                            <span style={{ fontWeight: 600 }}>DA</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>Prix de livraison</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: deliveryType === 'home' ? 700 : 400 }}>
                                    <input type="radio" checked={deliveryType === 'home'} onChange={() => setDeliveryType('home')} style={{ accentColor: '#27ae60' }} />
                                    التوصيل للمنزل (Home)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: deliveryType === 'office' ? 700 : 400 }}>
                                    <input type="radio" checked={deliveryType === 'office'} onChange={() => setDeliveryType('office')} style={{ accentColor: '#27ae60' }} />
                                    توصيل للمكتب (Office)
                                </label>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ color: '#aaa', fontSize: '12px' }}>{activeWilaya.name} / {activeWilaya.nameAr}</span>
                            <span style={{ fontWeight: 700, color: '#000' }}>{deliveryFee.toLocaleString()} DA</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #f0f0f0', paddingTop: '15px', marginTop: '10px' }}>
                        <span style={{ fontWeight: 800, fontSize: '16px' }}>Prix Total</span>
                        <span style={{ fontWeight: 800, fontSize: '18px', color: '#000' }}>{totalPrice.toLocaleString()} DA</span>
                    </div>
                </div>
            )}

            {/* Footer: Quantity + Confirm */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0 15px', fontSize: '18px', fontWeight: 600 }}>+</button>
                    <div style={{ padding: '12px 20px', backgroundColor: '#f9f9f9', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', fontWeight: 700, minWidth: '45px', textAlign: 'center' }}>{quantity}</div>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0 15px', fontSize: '18px', fontWeight: 600 }}>-</button>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                        flex: 1,
                        backgroundColor: isSubmitting ? '#999' : '#27ae60',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    {isSubmitting ? 'CHARGEMENT...' : 'CLIQUEZ ICI POUR CONFIRMER'}
                </button>
            </div>
        </div>
    );
}
