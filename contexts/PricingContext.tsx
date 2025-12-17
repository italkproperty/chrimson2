import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../services/mockDb';
import { ServiceProduct, Currency } from '../types';

interface PricingContextType {
  products: ServiceProduct[];
  packages: ServiceProduct[];
  addons: ServiceProduct[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInNad: number) => string;
  convertPrice: (amountInNad: number) => number;
  updateProductPrice: (id: string, price: number) => void;
  updateProductTimeline: (id: string, timeline: string) => void;
  toggleProductActive: (id: string) => void;
  refreshProducts: () => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [currency, setCurrency] = useState<Currency>('NAD');
  const [rates, setRates] = useState(db.getExchangeRates());

  const refreshProducts = () => {
    setProducts([...db.getProducts()]);
    setRates(db.getExchangeRates());
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const convertPrice = (amountInNad: number): number => {
    if (currency === 'NAD') return amountInNad;
    const rate = rates[currency];
    return Number((amountInNad * rate).toFixed(2));
  };

  const formatPrice = (amountInNad: number): string => {
    const converted = convertPrice(amountInNad);
    
    const symbolMap: Record<Currency, string> = {
      NAD: 'N$',
      ZAR: 'R',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥'
    };

    return `${symbolMap[currency]} ${converted.toLocaleString(undefined, { 
      minimumFractionDigits: currency === 'JPY' ? 0 : 2, 
      maximumFractionDigits: currency === 'JPY' ? 0 : 2 
    })}`;
  };

  const updateProductPrice = (id: string, price: number) => {
    const success = db.updateProductPrice(id, price);
    if (success) refreshProducts();
  };

  const updateProductTimeline = (id: string, timeline: string) => {
    const success = db.updateProductTimeline(id, timeline);
    if (success) refreshProducts();
  };

  const toggleProductActive = (id: string) => {
    const success = db.toggleProductActive(id);
    if (success) refreshProducts();
  };

  const packages = products.filter(p => p.type === 'package');
  const addons = products.filter(p => p.type === 'addon');

  return (
    <PricingContext.Provider value={{ 
      products, 
      packages, 
      addons, 
      currency, 
      setCurrency, 
      formatPrice, 
      convertPrice,
      updateProductPrice,
      updateProductTimeline,
      toggleProductActive,
      refreshProducts 
    }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};