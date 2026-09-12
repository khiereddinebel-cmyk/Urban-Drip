import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'Contact Urban Drip | Customer Support & Location',
    description: 'Get in touch with Urban Drip. Reach out via WhatsApp or Instagram for customer support, store location, and order inquiries in Algeria.',
    alternates: {
        canonical: 'https://urbandrip.dz/contact',
    },
    openGraph: {
        title: 'Contact Urban Drip | Customer Support & Location',
        description: 'Get in touch with Urban Drip. Reach out via WhatsApp or Instagram for customer support, store location, and order inquiries in Algeria.',
        url: 'https://urbandrip.dz/contact',
    },
};

export default function Page() {
    return <ContactClient />;
}
