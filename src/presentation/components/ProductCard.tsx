import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../domain/entities/Product';
import { getProductImageUrl } from '../../shared/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  pricePrefix?: string;
}

export default function ProductCard({ product, pricePrefix = "" }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product.images?.[0]);

  return (
    <Link href={`/product/${product.id}`} className="group block w-[250px] flex-shrink-0 px-3">
      <div className="relative aspect-square w-full bg-white flex items-center justify-center mb-4 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105 p-1"
          sizes="250px"
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
