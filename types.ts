import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
  slug: string;
  // Detail Page Content
  heroImage?: string;
  shortSummary?: string;
  fullContent?: {
    definition: string;
    whoIsItFor: string[];
    advantages: string[];
    limitations: string[];
    requirements: string[];
    compliance: string;
    whyChrimson: string;
  };
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  relatedServices?: string[]; // slugs
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TimelineStep {
  title: string;
  description: string;
  duration: string;
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  isThinking?: boolean;
}

export interface WizardQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
    nextId?: string;
    recommendation?: string;
  }[];
}

// --- Blog & Admin Types ---

export interface BlogContent {
  title: string;
  content: string; // HTML
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  author: string;
  date: string;
  scheduledDate?: string; // For Content Calendar
  category: string;
  readTime: string;
  imageUrl: string;
  imageCaption?: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  
  // Default Language (English)
  title: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;

  // Multilingual Support
  translations?: {
    de?: BlogContent; // German
    pt?: BlogContent; // Portuguese
    zh?: BlogContent; // Chinese
  };
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type Currency = 'NAD' | 'USD' | 'EUR' | 'GBP' | 'ZAR' | 'JPY';
export type PaymentMethod = 'EFT' | 'PayToday' | 'POS' | 'Cash';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  reference?: string;
  method: PaymentMethod;
}

export interface FinancialDoc {
  id: string;
  type: 'invoice' | 'quotation';
  number: string; // INV-2025-001 or QUO-2025-001
  
  // Client Details
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  clientPhone?: string;
  clientVatNo?: string;
  clientAddress?: string; // Physical
  clientPostalAddress?: string;

  // Document Details
  items: InvoiceItem[];
  currency: Currency;
  subtotal: number;
  vatRate: number; 
  vatAmount: number;
  discountAmount: number; // can be calculated from % in UI
  total: number;
  
  issueDate: string;
  dueDate?: string; // Invoice Only
  validUntil?: string; // Quotation Only
  
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'accepted' | 'rejected' | 'expired' | 'pending';
  
  // Invoice Specifics
  paymentHistory?: PaymentRecord[];
  
  // Quotation Specifics
  terms?: string;
  deliverables?: string;
  acceptanceDate?: string;

  // Notes
  notes?: string; // Client facing
  internalNotes?: string; // Admin only
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  status: 'active' | 'lead' | 'inactive';
  joinedDate: string;
  totalSpend: number;
}

export interface RegistrationProject {
  id: string;
  clientName: string;
  serviceType: 'Pty Ltd' | 'CC' | 'NPO' | 'Compliance' | 'NAMFISA';
  reference: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
  status: 'pending' | 'in_progress' | 'waiting_client' | 'completed';
  startDate: string;
  stages: {
    id: string;
    label: string;
    completed: boolean;
    date?: string;
  }[];
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface User {
  email: string;
  name: string;
  role: 'admin';
}

// --- Dynamic Pricing Types ---

export type ServiceCategory = 'Registration' | 'Foreign-Owned' | 'NGO' | 'Regulatory' | 'Compliance' | 'Tourism' | 'Financial';

export interface ServiceProduct {
  id: string;
  name: string;
  price: number; // Base price in NAD
  description: string;
  type: 'package' | 'addon';
  category: ServiceCategory;
  features?: string[]; // Only for packages
  recommended?: boolean;
  active: boolean;
  deleted?: boolean; // Soft delete safeguard
  saveAmount?: string; // Optional display text for packages
  tagline?: string; // Optional display text
  timeline?: string; // e.g. "7-14 Days"
}

export interface ExchangeRates {
  NAD: number;
  ZAR: number;
  USD: number;
  EUR: number;
  GBP: number;
  JPY: number;
}

// --- Order Wizard Types ---

export interface OrderPackage extends ServiceProduct {} // Alias for compatibility
export interface OrderAddOn extends ServiceProduct {} // Alias for compatibility

export interface OrderState {
  // Step 1: Selection
  selectedPackageId: string | null;
  selectedAddOns: string[];
  
  // Step 2: Customer
  customerName: string;
  customerIdNumber: string; // Added field
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  referralSource: string;

  // Step 3: Business (Removed from Steps in new flow, but handled in Service Step as Data)
  businessName1: string; // Kept for backend compatibility
  businessName2: string; // Alternative
  businessName3: string; // Alternative
  
  businessType: string;
  uploads: {
    idCopy?: string; // Mock URL
    addressProof?: string; // Mock URL
  };

  // Step 5: Payment
  paymentMethod: PaymentMethod;
  currency: Currency;
}

// --- Analytics & Trust Types ---

export type AnalyticsEventType = 'page_view' | 'start_registration' | 'order_completed' | 'contact_click' | 'blog_to_service_click';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  details?: Record<string, any>;
  timestamp: string;
}

export interface CaseSnippet {
  id: string;
  businessType: string; // e.g. CC, Pty Ltd, NPO
  outcome: string; // e.g. Tender-ready, Compliance approved
  timeframe: string; // e.g. 14 days
}

export interface TrustConfig {
  trustedCount: number;
  caseSnippets: CaseSnippet[];
  showAuthorityLogos: boolean;
}