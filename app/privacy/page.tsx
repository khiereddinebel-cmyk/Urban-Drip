import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
    title: 'Privacy Policy | Urban Drip',
    description: 'Learn how Urban Drip protects user data, contact details, and privacy for customer orders in Algeria.',
    alternates: {
        canonical: 'https://urbandrip.dz/privacy',
    },
    openGraph: {
        title: 'Privacy Policy | Urban Drip',
        description: 'Learn how Urban Drip protects user data, contact details, and privacy for customer orders in Algeria.',
        url: 'https://urbandrip.dz/privacy',
    },
};

export default function Page() {
    return <PrivacyClient />;
}
