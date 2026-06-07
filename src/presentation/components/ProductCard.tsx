import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../domain/entities/Product';
import { getProductImageUrl } from '../..//shared/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  pricePrefix?: string;
}

export default function ProductCard({ product, pricePrefix = "" }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product.images?.[0]);
  
  return (
    <Link href={`/product/${product.id}`} className="group block w-full px-2">
      <div className="relative aspect-square w-full bg-white p-4 flex items-center justify-center mb-4 overflow-hidden border border-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105 p-3"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          unoptimized
        />
      </div>
      <div className="flex flex-col items-center text-center px-1 mt-2 w-full">
        <h3 
          className="text-[13px] md:text-[14px] font-sans uppercase line-clamp-2 w-full" 
          style={{ letterSpacing: '1px', fontWeight: 500, color: '#111', marginBottom: '4px', lineHeight: '1.4' }}
        >
          {product.name}
        </h3>
        <p 
          className="text-[13px] md:text-[14px] font-sans uppercase"
          style={{ fontWeight: 600, color: '#222', letterSpacing: '1px' }}
        >
          {pricePrefix ? `${pricePrefix} ` : ""}{product.price.toLocaleString()} DA
        </p>
      </div>
    </Link>
  );
}
