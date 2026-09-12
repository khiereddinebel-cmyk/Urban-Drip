import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Urban Drip',
    description: 'Read the terms of service, exchange policies, and quality guarantee for Urban Drip orders in Algeria.',
    alternates: {
        canonical: 'https://urbandrip.dz/terms',
    },
    openGraph: {
        title: 'Terms & Conditions | Urban Drip',
        description: 'Read the terms of service, exchange policies, and quality guarantee for Urban Drip orders in Algeria.',
        url: 'https://urbandrip.dz/terms',
    },
};

export default function Page() {
    return <TermsClient />;
}
