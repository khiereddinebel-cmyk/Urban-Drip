import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../domain/entities/Product';
import { getProductImageUrl } from '../../shared/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  pricePrefix?: string;
  className?: string;
}

export default function ProductCard({ product, pricePrefix = "", className = "" }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product.images?.[0]);

  const widthClass = className.includes('w-') ? '' : 'w-[200px] md:w-[240px]';

  return (
    <Link 
      href={`/product/${product.id}`} 
      className={`group block flex-shrink-0 snap-start ${widthClass} ${className}`}
      style={{ paddingLeft: '12px', paddingRight: '12px' }}
    >
      <div className="relative aspect-square w-full bg-white flex items-center justify-center mb-4 overflow-hidden border border-gray-200 rounded-sm">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 200px, 240px"
          unoptimized
        />
      </div>
      <div className="flex flex-col items-start text-left w-full mt-2">
        <h3 
          className="text-[13px] md:text-[14px] font-sans font-medium line-clamp-2 w-full text-black" 
          style={{ marginBottom: '4px', lineHeight: '1.4', textTransform: 'none' }}
        >
          {product.name}
        </h3>
        <p 
          className="text-[13px] md:text-[14px] font-sans font-bold text-black"
        >
          {pricePrefix ? `${pricePrefix} ` : ""}{product.price.toLocaleString()} DA
        </p>
      </div>
    </Link>
  );
}
