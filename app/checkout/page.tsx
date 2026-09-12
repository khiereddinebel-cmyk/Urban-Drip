import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
    title: 'Checkout | Urban Drip',
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <CheckoutClient />;
}
