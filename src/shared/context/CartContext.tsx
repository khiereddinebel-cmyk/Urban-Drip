'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../../domain/entities/Product';

interface CartItem extends Product {
  quantity: number;
  selectedSize: string | number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, selectedSize: string | number) => void;
  removeFromCart: (productId: string, selectedSize: string | number) => void;
  updateQuantity: (productId: string, selectedSize: string | number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  lastAddedItem: CartItem | null;
  clearLastAddedItem: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('urban-drip-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('urban-drip-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, selectedSize: string | number) => {
    const newItem = { ...product, quantity, selectedSize };
    setLastAddedItem(newItem);
    
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, newItem];
    });
  };

  const clearLastAddedItem = () => {
    setLastAddedItem(null);
  };

  const removeFromCart = (productId: string, selectedSize: string | number) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.id === productId && item.selectedSize === selectedSize)
    ));
  };

  const updateQuantity = (productId: string, selectedSize: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.selectedSize === selectedSize 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => {
      const activePrice = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
      return total + (activePrice || 0) * item.quantity;
    },
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        lastAddedItem,
        clearLastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
