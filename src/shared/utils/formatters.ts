export const formatCurrency = (amount: number, locale = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'DZD', // Algerian Dinar
        minimumFractionDigits: 2,
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
    }).format(new Date(dateString));
};
