import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../domain/entities/Product';

interface ProductCardProps {
  product: Product;
  pricePrefix?: string;
}

export default function ProductCard({ product, pricePrefix = "" }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block w-[280px] flex-shrink-0 px-4">
      <div className="relative aspect-square w-full bg-[var(--bg)] p-6 flex items-center justify-center mb-6 overflow-hidden border border-[var(--border-color)]">
        <Image
          src={product.images?.[0] || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105 p-2"
          sizes="280px"
          unoptimized
        />
      </div>
      <div className="flex flex-col items-start text-left px-1 mt-3 w-full">
        <h3 
          className="text-[14px] md:text-[16px] font-sans uppercase line-clamp-2 w-full" 
          style={{ letterSpacing: '0.5px', fontWeight: 400, color: '#333', marginBottom: '2px', lineHeight: '1.4' }}
        >
          {product.name}
        </h3>
        <p 
          className="text-[14px] md:text-[16px] font-sans uppercase"
          style={{ fontWeight: 400, color: '#555', letterSpacing: '0.5px' }}
        >
          {pricePrefix ? `${pricePrefix} ` : ""}{product.price.toLocaleString()} DA
        </p>
      </div>
    </Link>
  );
}
