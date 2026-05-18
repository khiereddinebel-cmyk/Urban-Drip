import { Product } from '../../domain/entities/Product';

const universalNikeSizes = [
    { size: '40', eu: 40, cm: 25 },
    { size: '41', eu: 41, cm: 26 },
    { size: '42', eu: 42, cm: 26.5 },
    { size: '43', eu: 43, cm: 27.5 },
    { size: '44', eu: 44, cm: 28 },
    { size: '45', eu: 45, cm: 29 }
];

export const mockProducts: Product[] = [
    {
        id: 'nike-vomero-5-supersonic',
        name: 'Nike Air Zoom Vomero 5 Supersonic',
        description: 'Electric style meets high-performance cushioning in this Supersonic edition.',
        price: 14500,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['White/Black/Sail'],
        images: [
            '/images/Products/Nike/Nike Wmns Zoom Vomero 5.webp',
            '/images/Products/Nike/Nike Air Max Dn Premium Electric Safari.webp',
            '/images/Products/Nike/Nike Air Max 95 OG Diffused Blue.webp',
            '/images/Products/Nike/Nike V2K Run Light Orewood Brown.jpg'
        ],
        category: 'sneakers',
        isExclusive: true,
        viewCount: 2500
    },
    {
        id: 'jordan-1-mid-blue-white',
        name: 'Nike Air Jordan 1 Mid Blue/White',
        description: 'Iconic mid-top sneaker with classic blue and white leather panels.',
        price: 7900,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['Blue/White'],
        images: [
            '/images/Products/Nike/Nike Air Jordan 1 Mid BlueWhite.jpg',
            '/images/Products/Nike/Nike Air Jordan 1 Mid Blue&White.webp',
            '/images/Products/Nike/Nike Dunk Low BlackWhite (Panda).jpg'
        ],
        category: 'sneakers',
        isExclusive: false,
        viewCount: 3100
    },
    {
        id: 'nike-dunk-low-panda',
        name: 'Nike Dunk Low Black/White Panda',
        description: 'The legendary Panda colorway returns in a clean black and white leather finish.',
        price: 6500,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['Black/White'],
        images: [
            '/images/Products/Nike/Nike Dunk Low BlackWhite (Panda).jpg',
            '/images/Products/Nike/Nike Dunk Low LX Brogue.avif',
            '/images/Products/Nike/Nike Air Jordan 1 Mid BlueWhite.jpg'
        ],
        category: 'sneakers',
        isExclusive: false,
        viewCount: 5200
    },
    {
        id: 'nike-air-max-dn-safari',
        name: 'Nike Air Max Dn Premium Electric Safari',
        description: 'Next-generation Air technology meets the classic Safari print.',
        price: 13800,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['Electric Safari'],
        images: [
            '/images/Products/Nike/Nike Air Max Dn Premium Electric Safari.webp',
            '/images/Products/Nike/Nike ACG Rufus Triple Black.avif',
            '/images/Products/Nike/Nike Wmns Zoom Vomero 5.webp'
        ],
        category: 'sneakers',
        isExclusive: true,
        viewCount: 1800
    },
    {
        id: 'nike-air-max-95-diffused-blue',
        name: 'Nike Air Max 95 OG Diffused Blue',
        description: 'Heritage running silhouette in a smooth diffused blue gradient.',
        price: 12500,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['Diffused Blue'],
        images: [
            '/images/Products/Nike/Nike Air Max 95 OG Diffused Blue.webp',
            '/images/Products/Nike/Nike V2K Run Light Orewood Brown.jpg',
            '/images/Products/Nike/Nike Wmns Zoom Vomero 5.webp'
        ],
        category: 'sneakers',
        isExclusive: false,
        viewCount: 1450
    },
    {
        id: 'nike-reactx-rejuven8-black',
        name: 'Nike ReactX Rejuven8 Triple Black',
        description: 'Ultra-comfortable recovery slide with ReactX foam technology.',
        price: 7500,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['Triple Black'],
        images: [
            '/images/Products/Nike/Nike Wmns Zoom Vomero 5.webp',
            '/images/Products/Nike/Nike Air Max 95 OG Diffused Blue.webp'
        ],
        category: 'sneakers',
        isExclusive: true,
        viewCount: 1540
    },
    {
        id: 'nike-v2k-run-orewood',
        name: 'Nike V2K Run Light Orewood Brown',
        description: 'Fast-forward to the early 2000s in a look that matches technical running heritage.',
        price: 12500,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['Light Orewood Brown'],
        images: [
            '/images/Products/Nike/Nike V2K Run Light Orewood Brown.jpg',
            '/images/Products/Nike/Nike Wmns Zoom Vomero 5.webp',
            '/images/Products/Nike/Nike Air Max 95 OG Diffused Blue.webp'
        ],
        category: 'sneakers',
        isExclusive: true,
        viewCount: 3200
    },
    {
        id: 'nike-dunk-low-lx-brogue',
        name: 'Nike Dunk Low LX Brogue',
        description: 'A classic silhouette with sophisticated wingtip detailing and premium leather.',
        price: 11500,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['White/Brown'],
        images: [
            '/images/Products/Nike/Nike Dunk Low LX Brogue.avif',
            '/images/Products/Nike/Nike Dunk Low BlackWhite (Panda).jpg',
            '/images/Products/Nike/Nike Air Jordan 1 Mid BlueWhite.jpg'
        ],
        category: 'sneakers',
        isExclusive: false,
        viewCount: 1280
    },
    {
        id: 'nike-acg-rufus-black',
        name: 'Nike ACG Rufus Triple Black',
        description: 'Rugged outdoor comfort in an easy-on, easy-off silhouette for all-day wear.',
        price: 9800,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['Triple Black'],
        images: [
            '/images/Products/Nike/Nike ACG Rufus Triple Black.avif',
            '/images/Products/Nike/Nike Calm SE Mule Faux Fur.jpg'
        ],
        category: 'sneakers',
        isExclusive: false,
        viewCount: 950
    },
    {
        id: 'nike-calm-se-mule-fur',
        name: 'Nike Calm SE Mule Faux Fur',
        description: 'Plush faux-fur lining meets a minimalist slip-on design for ultimate relaxation.',
        price: 8500,
        brand: 'nike',
        sizes: universalNikeSizes,
        colors: ['Cream/Off-white'],
        images: [
            '/images/Products/Nike/Nike Calm SE Mule Faux Fur.jpg',
            '/images/Products/Nike/Nike ACG Rufus Triple Black.avif'
        ],
        category: 'sneakers',
        isExclusive: false,
        viewCount: 1100
    },
    {
        id: 'air-jordan-2-alternate',
        name: 'Air Jordan 2 Retro Alternate 87',
        description: 'Classic black and red colorway honoring Michael Jordan\'s legacy.',
        price: 18500,
        brand: 'jordan',
        sizes: universalNikeSizes,
        colors: ['Black/Varsity Red'],
        images: [
            '/images/jordan-collection-hero.jpg'
        ],
        category: 'sneakers',
        isExclusive: true,
        viewCount: 4200
    },
    {
        id: 'air-jordan-4-alternate',
        name: 'Air Jordan 4 Retro Alternate 89',
        description: 'Premium white tumbled leather paired with Gym Red accents.',
        price: 21500,
        brand: 'jordan',
        sizes: universalNikeSizes,
        colors: ['White/Gym Red'],
        images: [
            '/images/jordan-collection-hero.jpg'
        ],
        category: 'sneakers',
        isExclusive: true,
        viewCount: 5800
    },
    {
        id: 'air-jordan-5-black-metallic',
        name: 'Air Jordan 5 Retro Black Metallic',
        description: 'The iconic stealthy black nubuck silhouette with metallic silver shark teeth.',
        price: 20500,
        brand: 'jordan',
        sizes: universalNikeSizes,
        colors: ['Black/Metallic Silver'],
        images: [
            '/images/jordan-collection-hero.jpg'
        ],
        category: 'sneakers',
        isExclusive: true,
        viewCount: 6100
    },
    {
        id: 'adidas-samba-og',
        name: 'Adidas Samba OG',
        description: 'Born on the pitch, the Samba is a timeless icon of street style.',
        price: 18000,
        brand: 'adidas',
        sizes: [{ size: 38, cm: 24 }, { size: 40, cm: 25 }, { size: 42, cm: 26.5 }],
        colors: ['Black/White'],
        images: [
            'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2670&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2670&auto=format&fit=crop'
        ],
        category: 'sneakers',
        isExclusive: false,
        viewCount: 2100
    },
    {
        id: 'onitsuka-tiger-mexico-66-yellow',
        name: 'Onitsuka Tiger MEXICO 66',
        description: 'The definitive lifestyle sneaker from Onitsuka Tiger, featuring the iconic heritage stripes.',
        price: 22000,
        brand: 'onitsuka-tiger',
        sizes: universalNikeSizes,
        colors: ['Yellow/Black'],
        images: [
            '/images/Products/onitsuka tiger/Onitsuka Tiger MEXICO 66.jpg'
        ],
        category: 'sneakers',
        isExclusive: false,
        viewCount: 3100
    },
    {
        id: 'new-balance-530',
        name: 'New Balance 530',
        description: 'A throwback to classic running shoe styles. The 530 combines everyday style with the modern tech of ABZORB cushioning.',
        price: 15500,
        brand: 'new-balance',
        sizes: universalNikeSizes,
        colors: ['Silver/White/Purple'],
        images: [
            '/images/new_balance_530.png'
        ],
        category: 'sneakers',
        isExclusive: false,
        viewCount: 4500
    },
    {
        id: 'asics-gel-kayano-14',
        name: 'ASICS GEL-KAYANO™ 14',
        description: 'Conveying a new perception to the retro running shape, the GEL-KAYANO™ 14 running shoe resurfaces with its late 2000s aesthetic.',
        price: 32000,
        brand: 'asics',
        sizes: universalNikeSizes,
        colors: ['White/Pure Silver'],
        images: [
            '/images/Products/asics/ASICS GEL-KAYANO 14.jfif'
        ],
        category: 'sneakers',
        isExclusive: true,
        viewCount: 4800
    }
];
