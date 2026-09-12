import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
    title: 'Shopping Cart | Urban Drip',
    robots: {
        index: false,
        follow: true,
    },
};

export default function Page() {
    return <CartClient />;
}
