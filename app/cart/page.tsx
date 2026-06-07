'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../src/shared/context/CartContext';
import { useAuth } from '../../src/shared/context/AuthContext';
import { getProductImageUrl } from '../../src/shared/utils/imageUtils';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { openLoginModal } = useAuth();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center text-center px-4 py-24">
                <h1 className="text-3xl md:text-5xl font-serif font-light uppercase tracking-widest text-black mb-8">
                    Votre panier est vide
                </h1>
                
                <Link 
                    href="/" 
                    className="inline-block bg-black text-white px-12 py-5 text-sm font-sans tracking-widest uppercase hover:opacity-80 transition-opacity mb-12"
                >
                    Continuer vos achats
                </Link>

                <div className="pt-8 border-t border-gray-100 w-full max-w-md">
                    <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-black mb-3">
                        Avez-vous un compte?
                    </h3>
                    <p className="text-xs text-gray-500 tracking-wider uppercase">
                        <button 
                            onClick={openLoginModal} 
                            className="underline text-black font-semibold uppercase hover:opacity-70 transition-opacity"
                        >
                            Connectez-vous
                        </button> pour finaliser votre commande plus rapidement.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen text-black py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-end border-b border-gray-100 pb-6 mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-light uppercase tracking-widest text-black m-0">
                        Votre Panier
                    </h1>
                    <Link href="/" className="text-xs md:text-sm text-gray-500 hover:text-black uppercase tracking-widest font-medium underline">
                        Continuer vos achats
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Cart Items List */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Table Header for Desktop */}
                        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr] pb-4 border-b border-gray-100 text-[10px] font-bold tracking-[2px] text-gray-400 uppercase">
                            <div>PRODUIT</div>
                            <div className="text-center">QUANTITE</div>
                            <div className="text-right">TOTAL</div>
                        </div>

                        {/* Cart Items */}
                        <div className="divide-y divide-gray-100">
                            {cart.map((item) => {
                                const imageUrl = getProductImageUrl(item.images?.[0]);
                                return (
                                    <div key={`${item.id}-${item.selectedSize}`} className="py-6 md:py-8 grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr] items-center gap-6">
                                        
                                        {/* Product info (Image, Title, Size) */}
                                        <div className="flex gap-4 md:gap-6 items-center">
                                            {/* Thumbnail frame */}
                                            <div className="relative w-24 h-24 md:w-28 md:h-28 bg-white border border-gray-100 shrink-0 flex items-center justify-center p-2">
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-1"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-sans font-medium uppercase text-black tracking-[1.5px] mb-1 truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-medium tracking-wide mb-2">
                                                    {item.price.toLocaleString()} DA
                                                </p>
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                                                    Taille: {item.selectedSize}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantity Controls & Delete button */}
                                        <div className="flex md:flex-col justify-between md:justify-center items-center gap-4">
                                            <div className="flex items-center border border-gray-200 bg-white">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                                    className="px-3 py-2 text-gray-400 hover:text-black font-light text-xs transition-colors"
                                                    aria-label="Diminuer la quantité"
                                                >
                                                    &mdash;
                                                </button>
                                                <div className="w-8 text-center text-xs font-semibold font-sans">{item.quantity}</div>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                                    className="px-3 py-2 text-gray-400 hover:text-black font-light text-xs transition-colors"
                                                    aria-label="Augmenter la quantité"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item.id, item.selectedSize)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                aria-label="Supprimer l'article"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Total Price */}
                                        <div className="text-right font-semibold text-sm md:text-base text-black tracking-wider border-t border-gray-50 pt-4 md:border-t-0 md:pt-0">
                                            <span className="md:hidden text-xs text-gray-400 uppercase tracking-widest font-normal mr-2">Total:</span>
                                            {(item.price * item.quantity).toLocaleString()} DA
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Order Summary Card */}
                    <div className="bg-gray-50 p-6 md:p-8 border border-gray-100">
                        <h3 className="text-sm font-sans font-bold uppercase tracking-[2px] text-black border-b border-gray-200 pb-4 mb-6">
                            RÉCAPITULATIF DE LA COMMANDE
                        </h3>
                        
                        <div className="space-y-4 text-xs font-sans tracking-[1.5px] uppercase text-gray-600 mb-8">
                            <div className="flex justify-between">
                                <span>Sous-total</span>
                                <span className="text-black font-semibold">{cartTotal.toLocaleString()} DA</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Livraison</span>
                                <span className="text-black font-semibold text-[10px] text-gray-400">Calculée à la caisse</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between text-sm text-black font-bold">
                                <span>Total Estimé</span>
                                <span className="text-lg text-black font-black tracking-normal">
                                    {cartTotal.toLocaleString()} DA
                                </span>
                            </div>
                        </div>

                        <Link 
                            href="/checkout"
                            className="block w-full text-center bg-black text-white py-4 text-xs font-sans tracking-[2px] uppercase font-bold hover:opacity-85 transition-opacity border-none rounded-none"
                        >
                            Passer à la caisse
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
