import { Metadata } from 'next';
import DeliveryClient from './DeliveryClient';

export const metadata: Metadata = {
    title: 'Delivery Information | Urban Drip',
    description: 'Learn about Urban Drip delivery options, shipping duration across 58 wilayas in Algeria, and cash-on-delivery service.',
    alternates: {
        canonical: 'https://urbandrip.dz/delivery',
    },
    openGraph: {
        title: 'Delivery Information | Urban Drip',
        description: 'Learn about Urban Drip delivery options, shipping duration across 58 wilayas in Algeria, and cash-on-delivery service.',
        url: 'https://urbandrip.dz/delivery',
    },
};

export default function Page() {
    return <DeliveryClient />;
}
