export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const getImageUrl = (url) => {
  if (!url) return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop";
  return url.startsWith('http') ? url : `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}${url}`;
};
