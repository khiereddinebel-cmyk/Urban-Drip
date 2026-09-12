import { Metadata } from 'next';
import SuccessClient from './SuccessClient';

export const metadata: Metadata = {
    title: 'Order Confirmation | Urban Drip',
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <SuccessClient />;
}
