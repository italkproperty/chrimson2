import { BlogPost, FinancialDoc, User, Client, RegistrationProject, Task, OrderState, ServiceProduct, ExchangeRates, Currency, AnalyticsEvent, TrustConfig, CaseSnippet, ServiceCategory } from '../types';

// --- Reinstated Services Catalog ---

const INITIAL_PRODUCTS: ServiceProduct[] = [
  // 1. Business Registration
  { id: 'svc_cc', name: 'CC Registration', price: 1800, type: 'package', category: 'Registration', description: 'Small business setup with member liability protection.', features: ['Name Reservation', 'Founding Statement', 'Tax Registration'], active: true, timeline: '7-14 Days', tagline: 'Standard CC' },
  { id: 'svc_pty', name: 'Pty Ltd Registration', price: 3850, type: 'package', category: 'Registration', description: 'Professional company structure for scalable growth.', features: ['Name Reservation', 'Memo & Articles', 'Share Certificates', 'Tax Registration'], recommended: true, active: true, timeline: '14-21 Days', tagline: 'Pty Ltd Standard' },
  { id: 'svc_pty_foreign', name: 'Foreign-Owned Pty Ltd', price: 5500, type: 'package', category: 'Foreign-Owned', description: 'Setup for international directors with offshore banking prep.', features: ['Foreign Director Filing', 'Courier Service', 'Registered Office', 'Local Representative'], active: true, timeline: '21-30 Days', tagline: 'International' },

  // 2. NGO / Not-for-Profit
  { id: 'svc_ngo', name: 'NGO / Section 21', price: 4500, type: 'package', category: 'NGO', description: 'Register a non-profit association for charities and missions.', features: ['Constitution Drafting', 'Welfare Application', 'Tax Exemption Advisory'], active: true, timeline: '30-60 Days', tagline: 'Not-for-Gain' },
  { id: 'svc_ngo_compliance', name: 'NGO Compliance Pack', price: 2500, type: 'addon', category: 'NGO', description: 'Updates to constitutions and welfare status reporting.', active: true, timeline: '14 Days' },
  { id: 'svc_ngo_filing', name: 'NPO Statutory Filing', price: 1200, type: 'addon', category: 'NGO', description: 'Annual returns for non-profit organizations.', active: true, timeline: '7 Days' },

  // 3. Regulatory Registrations
  { id: 'svc_ntb', name: 'NTB Registration', price: 3500, type: 'package', category: 'Regulatory', description: 'Namibia Tourism Board certification for lodges and shuttles.', features: ['Public Liability Advice', 'Fitness Certificate Liaison', 'Certificate Collection'], active: true, timeline: '2-4 Months', tagline: 'Tourism Board' },
  { id: 'svc_namfisa', name: 'NAMFISA Registration', price: 12500, type: 'package', category: 'Regulatory', description: 'Full microlending or insurance brokerage registration.', features: ['Compliance Manual', 'Principal Officer Vetting', 'Application Drafting'], active: true, timeline: '3-6 Months', tagline: 'Financial Regulator' },

  // 4. Compliance & Good Standing
  { id: 'add_gs_bipa', name: 'BIPA Good Standing', price: 650, type: 'addon', category: 'Compliance', description: 'Proves annual duties are paid and company is active.', active: true, timeline: '2-5 Days' },
  { id: 'add_gs_namra', name: 'NAMRA Good Standing', price: 850, type: 'addon', category: 'Compliance', description: 'Essential tax compliance certificate for tenders.', active: true, timeline: '3-7 Days' },
  { id: 'add_gs_ssc', name: 'SSC Good Standing', price: 450, type: 'addon', category: 'Compliance', description: 'Social Security proof for employee contributions.', active: true, timeline: '1-3 Days' },
  { id: 'add_gs_pack', name: 'Tender Readiness Pack', price: 2200, type: 'package', category: 'Compliance', description: 'All 3 good standings + SME certificate bundled.', features: ['NAMRA Good Standing', 'BIPA Good Standing', 'SSC Good Standing', 'SME Certificate'], active: true, timeline: '7 Days', tagline: 'Bundle' },
  
  // Standalone Docs
  { id: 'add_share_cert', name: 'Share Certificate', price: 350, type: 'addon', category: 'Compliance', description: 'Official proof of ownership for shareholders.', active: true, timeline: '24 Hours' },
  { id: 'add_founding_stmt', name: 'Founding Statement Copy', price: 400, type: 'addon', category: 'Compliance', description: 'Certified copy of your CC registration.', active: true, timeline: '2 Days' },
  { id: 'add_conf_letter', name: 'Confirmation Letter', price: 300, type: 'addon', category: 'Compliance', description: 'Letter confirming company details for bank/visa.', active: true, timeline: '24 Hours' },
];

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Why Pty Ltd is Better for Tenders than a CC',
    slug: 'pty-ltd-vs-cc-tenders',
    excerpt: 'Understanding the key differences in liability and scalability that make Private Companies the preferred vehicle for government contracts in Namibia.',
    content: `<h1>Why Pty Ltd is Better for Tenders than a CC</h1>...`,
    author: 'Sarah Ndlovu', date: '2023-10-15', category: 'Compliance', readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
    tags: ['Business Tips', 'Tenders'], status: 'published',
    seoTitle: 'Pty Ltd vs CC for Tenders Namibia', seoDescription: 'Choosing the right entity for Namibian government tenders.'
  }
];

const INITIAL_TRUST_CONFIG: TrustConfig = {
  trustedCount: 150,
  caseSnippets: [
    { id: '1', businessType: 'Close Corporation', outcome: 'Tender-ready', timeframe: '14 days' },
    { id: '2', businessType: 'Private Company', outcome: 'Foreign-owned registered & banked', timeframe: '21 days' },
    { id: '3', businessType: 'Startup', outcome: 'Fully compliant with BIPA, NAMRA & SSC', timeframe: '10 days' },
  ],
  showAuthorityLogos: true
};

class MockDB {
  private posts: BlogPost[] = [];
  private docs: FinancialDoc[] = [];
  private clients: Client[] = [];
  private projects: RegistrationProject[] = [];
  private tasks: Task[] = [];
  private products: ServiceProduct[] = [];
  private analytics: AnalyticsEvent[] = [];
  private trustConfig: TrustConfig = INITIAL_TRUST_CONFIG;
  private adminUser: User = { name: 'Chrimson Admin', email: 'hello@chrimsoncc.com', role: 'admin' };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedPosts = localStorage.getItem('chrimson_db_posts');
      const storedDocs = localStorage.getItem('chrimson_db_docs');
      const storedProducts = localStorage.getItem('chrimson_db_products');
      const storedAnalytics = localStorage.getItem('chrimson_db_analytics');
      const storedTrust = localStorage.getItem('chrimson_db_trust');

      this.posts = storedPosts ? JSON.parse(storedPosts) : [...INITIAL_POSTS];
      this.docs = storedDocs ? JSON.parse(storedDocs) : [];
      this.products = storedProducts ? JSON.parse(storedProducts) : [...INITIAL_PRODUCTS];
      this.analytics = storedAnalytics ? JSON.parse(storedAnalytics) : [];
      this.trustConfig = storedTrust ? JSON.parse(storedTrust) : INITIAL_TRUST_CONFIG;
    } catch (e) {
      this.products = [...INITIAL_PRODUCTS];
    }
  }

  private saveToStorage() {
    localStorage.setItem('chrimson_db_posts', JSON.stringify(this.posts));
    localStorage.setItem('chrimson_db_docs', JSON.stringify(this.docs));
    localStorage.setItem('chrimson_db_analytics', JSON.stringify(this.analytics));
    localStorage.setItem('chrimson_db_trust', JSON.stringify(this.trustConfig));
    localStorage.setItem('chrimson_db_products', JSON.stringify(this.products));
  }

  // --- Products Logic (Categorized & Safe) ---
  getProducts(includeDeleted = false) { 
    return includeDeleted ? this.products : this.products.filter(p => !p.deleted); 
  }

  updateProduct(id: string, updates: Partial<ServiceProduct>) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      // Validation Safeguard: Mandatory Category
      if (updates.category === undefined && !this.products[idx].category) {
        throw new Error("Category is required for all services.");
      }
      this.products[idx] = { ...this.products[idx], ...updates };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteProduct(id: string) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      // Soft Delete Safeguard
      this.products[idx].deleted = true;
      this.products[idx].active = false;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  updateProductPrice(id: string, price: number) { return this.updateProduct(id, { price }); }
  updateProductTimeline(id: string, timeline: string) { return this.updateProduct(id, { timeline }); }
  toggleProductActive(id: string) { 
    const p = this.products.find(p => p.id === id);
    if (p) return this.updateProduct(id, { active: !p.active });
    return false;
  }

  // Analytics
  trackEvent(type: AnalyticsEvent['type'], details?: any) {
    this.analytics.push({
      id: Math.random().toString(36).substr(2, 9),
      type, details, timestamp: new Date().toISOString()
    });
    this.saveToStorage();
  }
  getAnalytics() { return this.analytics; }

  // Trust Config
  getTrustConfig() { return this.trustConfig; }
  updateTrustConfig(config: Partial<TrustConfig>) {
    this.trustConfig = { ...this.trustConfig, ...config };
    this.saveToStorage();
    return this.trustConfig;
  }

  // --- Fix: Added missing CaseSnippet methods for AnalyticsDashboard ---
  addCaseSnippet(snippet: Omit<CaseSnippet, 'id'>) {
    const newSnippet: CaseSnippet = { ...snippet, id: Math.random().toString(36).substr(2, 9) };
    this.trustConfig.caseSnippets.push(newSnippet);
    this.saveToStorage();
    return newSnippet;
  }

  deleteCaseSnippet(id: string) {
    this.trustConfig.caseSnippets = this.trustConfig.caseSnippets.filter(s => s.id !== id);
    this.saveToStorage();
  }

  updateCaseSnippet(id: string, updates: Partial<CaseSnippet>) {
    this.trustConfig.caseSnippets = this.trustConfig.caseSnippets.map(s => s.id === id ? { ...s, ...updates } : s);
    this.saveToStorage();
  }

  // Basic DB methods
  getPosts() { return this.posts; }
  // --- Fix: Added missing getPostById and updatePost methods for BlogEditor ---
  getPostById(id: string) { return this.posts.find(p => p.id === id); }
  getPostBySlug(slug: string) { return this.posts.find(p => p.slug === slug); }
  createPost(post: BlogPost) { this.posts.unshift(post); this.saveToStorage(); return post; }
  updatePost(post: BlogPost) {
    const idx = this.posts.findIndex(p => p.id === post.id);
    if (idx !== -1) {
      this.posts[idx] = post;
      this.saveToStorage();
    }
  }
  deletePost(id: string) { this.posts = this.posts.filter(p => p.id !== id); this.saveToStorage(); }
  getFinancialDocs() { return this.docs; }
  createFinancialDoc(doc: FinancialDoc) { this.docs.unshift(doc); this.saveToStorage(); return doc; }
  getFinancialStats() {
    return {
      revenue: this.docs.filter(d => d.type === 'invoice' && d.status === 'paid').reduce((sum, d) => sum + d.total, 0),
      pendingInvoices: this.docs.filter(d => d.type === 'invoice' && d.status !== 'paid').length,
    };
  }
  getClients() { return this.clients; }
  getProjects() { return this.projects; }
  getPortalData(clientId: string) {
    const client = this.clients.find(c => c.id === clientId);
    return { client, projects: [], invoices: [] };
  }
  processOrder(order: any) {
    this.trackEvent('order_completed', { service: order.selectedPackageId, value: order.grandTotal });
    return { client: { id: 'demo' }, project: { reference: 'REF-DEMO' } };
  }
  getUser() { return this.adminUser; }
  getExchangeRates() { 
    return { 
      NAD: 1, 
      ZAR: 1, 
      USD: 0.053, 
      EUR: 0.049, 
      GBP: 0.042,
      JPY: 7.82 // 1 NAD approx 7.8 JPY
    }; 
  }
}

export const db = new MockDB();