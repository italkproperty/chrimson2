
import { 
  Building2, 
  FileCheck, 
  Briefcase, 
  Globe2, 
  ShieldCheck, 
  Files,
  BadgeCheck,
  TrendingUp,
  Scale,
  Landmark
} from 'lucide-react';
import { NavItem, ServiceItem, PricingTier, FaqItem, TimelineStep, WizardQuestion, OrderPackage, OrderAddOn } from './types';

export const CONTACT_INFO = {
  email: "hello@chrimsoncc.com",
  phone: "+264 81 712 1176",
  address: "77 Independence Avenue, Windhoek, Namibia",
  mapLink: "https://maps.google.com/?q=77+Independence+Avenue+Windhoek"
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services', children: [
      { label: 'Private Company (Pty Ltd)', href: '/services/private-company-pty-ltd' },
      { label: 'Close Corporation (CC)', href: '/services/close-corporation-cc' },
      { label: 'NPO Registration', href: '/services/npo-registration-namibia' },
      { label: 'NAMFISA Compliance', href: '/services/namfisa-compliance' },
      { label: 'NTB Registration', href: '/services/ntb-registration' },
      { label: 'Tender Compliance', href: '/services/tender-compliance' }
  ]},
  { label: 'Pricing', href: '/pricing' },
  { label: 'Tools', href: '/tools' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const TESTIMONIALS = [
  {
    id: 1,
    text: "Chrimson made the Pty Ltd registration process incredibly smooth. We were tender-ready in just 2 weeks, exactly as promised.",
    author: "Johanna S.",
    role: "Director, Oshana Trading",
    rating: 5
  },
  {
    id: 2,
    text: "The NAMFISA compliance team is top-notch. They handled our microlending application with such professionalism. Highly recommended.",
    author: "Petrus A.",
    role: "Founder, QuickCash Namibia",
    rating: 5
  },
  {
    id: 3,
    text: "I was confused about whether to register a CC or Pty Ltd. Their consultation cleared everything up. Best service in Windhoek!",
    author: "Sarah M.",
    role: "Local Entrepreneur",
    rating: 5
  }
];

export const SERVICES: ServiceItem[] = [
  {
    title: 'Private Company (Pty Ltd)',
    slug: 'private-company-pty-ltd',
    description: 'The standard for scalable Namibian businesses. Unlimited shareholders and tender eligibility.',
    icon: Building2,
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
    shortSummary: 'The gold standard for Namibian businesses seeking growth, tender eligibility, and limited liability protection.',
    seo: {
      title: 'Pty Ltd Registration in Namibia | Expert Setup by Chrimson',
      description: 'Register your Private Company (Pty Ltd) in Namibia fast. We handle BIPA reservation, drafting, and tax registration. 100% compliant for tenders.',
      keywords: ['Pty Ltd registration Namibia', 'BIPA registration', 'Namibia company registration', 'business setup Windhoek']
    },
    fullContent: {
      definition: `A Private Company, commonly known as a **Pty Ltd** (Proprietary Limited), is the most versatile and professional business structure available in Namibia under the Companies Act No. 28 of 2004. Unlike a Close Corporation (CC), a Pty Ltd is a distinct legal entity entirely separate from its shareholders, offering the highest level of liability protection.

      In the modern Namibian business landscape, the Pty Ltd has become the preferred vehicle for serious entrepreneurs, government tenders, and joint ventures. It allows for 1 to 50 shareholders, making it ideal for scalable businesses that plan to bring in investors or partners.`,
      whoIsItFor: [
        'Entrepreneurs seeking government tenders (the preferred structure for bid committees).',
        'Businesses planning to raise capital or bring in investors.',
        'Joint ventures between Namibian and foreign entities.',
        'High-risk industries where maximum liability protection is required.',
        'Companies intending to list on the Namibian Stock Exchange (NSX) in the future.'
      ],
      advantages: [
        '**Limited Liability:** Shareholders are generally not personally liable for the company’s debts.',
        '**Perpetual Succession:** The company continues to exist even if shareholders change or pass away.',
        '**Professional Credibility:** Pty Ltds are perceived as more stable and professional by banks and corporate clients.',
        '**Tender Eligibility:** It is the standard requirement for most high-value government and private sector contracts.',
        '**Flexible Ownership:** Easily transfer shares or issue new ones to raise funds.'
      ],
      limitations: [
        '**Higher Compliance Load:** Requires annual auditing (or independent review) and stricter record-keeping than a CC.',
        '**Cost:** Initial registration and maintenance costs are slightly higher than legacy structures.',
        '**Complexity:** Requires formal meetings, resolutions, and adherence to the Companies Act.'
      ],
      requirements: [
        'Minimum of 1 Director and 1 Shareholder (can be the same person).',
        'Certified ID/Passport copies for all directors.',
        'Proof of Residence (Utility Bill/Lease Agreement).',
        'Proposed Company Names (for BIPA reservation).',
        'Auditor appointment (we can assist with this nomination).'
      ],
      compliance: 'Once registered, a Pty Ltd must file Annual Returns with BIPA to avoid de-registration. It must also register for Income Tax and, if applicable, VAT and PAYE with NAMRA. Keeping your company in "Good Standing" is critical for ongoing tender eligibility.',
      whyChrimson: 'We don\'t just file forms; we structure your company for success. Our service includes professional drafting of the Memorandum and Articles of Association tailored to your needs, ensuring you are protected from day one. We also handle the tax registration and share certificate issuance, providing a turnkey solution.'
    },
    relatedServices: ['tender-compliance', 'namfisa-compliance']
  },
  {
    title: 'Close Corporation (CC)',
    slug: 'close-corporation-cc',
    description: 'Cost-effective structure for small businesses with up to 10 members. Simple management.',
    icon: Briefcase,
    heroImage: 'https://images.unsplash.com/photo-1554224155-984063584d45?auto=format&fit=crop&q=80',
    shortSummary: 'A simple, flexible structure for small owner-managed businesses. Note: New registrations are limited.',
    seo: {
      title: 'Close Corporation (CC) Services Namibia | Chrimson Consultants',
      description: 'Manage or convert your Close Corporation in Namibia. Expert advice on CC member changes, good standing, and BIPA compliance.',
      keywords: ['Close Corporation Namibia', 'CC registration Windhoek', 'CC vs Pty Ltd Namibia']
    },
    fullContent: {
      definition: `A Close Corporation (CC) is a simplified legal entity designed for small businesses. It is governed by the Close Corporations Act. While BIPA has moved towards phasing out new CC registrations in favor of Pty Ltds, existing CCs remain a valid and popular way to trade in Namibia.
      
      **Important Note:** New CC registrations are becoming restricted. Most new businesses are now advised to register as a Pty Ltd. However, we assist with buying existing shelf CCs or managing current ones.`,
      whoIsItFor: [
        'Small, family-owned businesses.',
        'Sole owners who want liability protection without the complexity of a company.',
        'Existing CC owners needing maintenance or member changes.'
      ],
      advantages: [
        '**Simplicity:** No need for annual audits (unless specified); an accounting officer is sufficient.',
        '**Lower Admin Costs:** Fewer formalities regarding meetings and resolutions.',
        '**Member Management:** Members actively manage the business; there is no separate board of directors.'
      ],
      limitations: [
        '**Limited Growth:** Capped at 10 natural persons as members (no companies can hold membership).',
        '**Capital Raising:** Cannot issue shares to investors.',
        '**Perception:** Sometimes viewed as "small-time" by large corporate procurers.'
      ],
      requirements: [
        'Amended Founding Statement (for member changes).',
        'Accounting Officer consent letter.',
        'Member ID copies and proof of address.'
      ],
      compliance: 'Annual duty payments to BIPA are mandatory to prevent deregistration. Tax filing requirements remain the same as other entities.',
      whyChrimson: 'If you have an existing CC, we ensure it stays compliant. We handle member amendments (adding/removing partners), name changes, and annual duty filings with speed and accuracy.'
    },
    relatedServices: ['private-company-pty-ltd', 'tender-compliance']
  },
  {
    title: 'NPO Registration',
    slug: 'npo-registration-namibia',
    description: 'Section 21 companies for NGOs, charities, and community foundations seeking grant eligibility.',
    icon: FileCheck,
    heroImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80',
    shortSummary: ' Establish a "Section 21" Association Not for Gain to serve your community and access funding.',
    seo: {
      title: 'NPO & Section 21 Registration Namibia | NGO Setup Experts',
      description: 'Register your Non-Profit Organization (NPO) or Section 21 Company in Namibia. We draft constitutions and handle BIPA & Welfare registration.',
      keywords: ['NPO registration Namibia', 'Section 21 company', 'NGO registration Windhoek', 'Charity setup Namibia']
    },
    fullContent: {
      definition: `In Namibia, Non-Profit Organizations are typically registered as "Associations Not for Gain" under Section 21 of the Companies Act. These entities exist to promote arts, science, religion, charity, or other cultural activities. 
      
      Profits cannot be distributed to members but must be reinvested into the organization's mission.`,
      whoIsItFor: [
        'Charities and welfare organizations.',
        'Community development projects.',
        'Religious institutions (Churches).',
        'Schools and educational institutes.',
        'Sports clubs and associations.'
      ],
      advantages: [
        '**Funding Eligibility:** Required for most international grants and government subsidies.',
        '**Tax Exemption:** Can apply for tax-exempt status with NAMRA.',
        '**Public Trust:** A formal legal structure builds credibility with donors and the public.'
      ],
      limitations: [
        '**No Profit Distribution:** Founders cannot withdraw profits as dividends.',
        '**Strict Auditing:** Donors often require rigorous financial transparency.',
        '**Complex Dissolution:** Assets must be transferred to another NPO upon closing.'
      ],
      requirements: [
        'A minimum of 7 members.',
        'Drafting of a Memorandum and Articles of Association with specific non-profit clauses.',
        'Reservation of name.',
        'Appointment of Auditors.'
      ],
      compliance: 'Must file annual returns and keep proper accounting records. If registered as a Welfare Organization, additional reporting to the Ministry of Health and Social Services is required.',
      whyChrimson: 'Setting up an NPO requires precise legal drafting to ensure you meet the criteria for "Not for Gain" status. We draft your constitution to meet BIPA standards and advise on the path to tax exemption.'
    },
    relatedServices: ['tender-compliance']
  },
  {
    title: 'NAMFISA Compliance',
    slug: 'namfisa-compliance',
    description: 'Registration for microlenders and financial institutions. We handle the regulatory framework.',
    icon: ShieldCheck,
    heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80',
    shortSummary: 'Essential registration for Microlenders and Non-Banking Financial Institutions in Namibia.',
    seo: {
      title: 'NAMFISA Registration & Compliance Services | Microlending License',
      description: 'Get your Microlending business registered with NAMFISA. We handle the application, compliance manual, and reporting requirements.',
      keywords: ['NAMFISA registration', 'microlender license Namibia', 'financial compliance Windhoek']
    },
    fullContent: {
      definition: `The Namibia Financial Institutions Supervisory Authority (NAMFISA) regulates non-banking financial institutions. If you intend to lend money, offer insurance, or manage pension funds, you **must** be registered with NAMFISA. Operating without a license is illegal and carries heavy penalties.`,
      whoIsItFor: [
        'Microlenders (Cash loan businesses).',
        'Insurance brokers and agents.',
        'Pension fund administrators.',
        'Friendly societies.'
      ],
      advantages: [
        '**Legal Operation:** Operate your business without fear of shutdown or fines.',
        '**Credibility:** NAMFISA registration signals trust to borrowers and clients.',
        '**Dispute Resolution:** Access to formal channels for debt recovery.'
      ],
      limitations: [
        '**Strict Oversight:** Regular reporting and inspections are mandatory.',
        '**Capital Requirements:** Proof of funds is often required for startup.',
        '**Timeframe:** Registration can take 3-6 months depending on the completeness of the application.'
      ],
      requirements: [
        'Company Registration Documents (Pty Ltd or CC).',
        'Police Clearance Certificates for all key individuals.',
        'Business Plan and Financial Projections.',
        'Compliance Manual (detailing anti-money laundering policies).',
        'Bank Account confirmation.'
      ],
      compliance: 'Quarterly levy returns (returns submission) and adherence to the Microlending Act. You must treat customers fairly and adhere to interest rate caps.',
      whyChrimson: 'NAMFISA applications are complex and often rejected due to incomplete policy documents. We provide a comprehensive "compliance pack" including the required business manuals and policy frameworks to ensure your application succeeds the first time.'
    },
    relatedServices: ['private-company-pty-ltd']
  },
  {
    title: 'NTB Registration',
    slug: 'ntb-registration',
    description: 'Mandatory certification for tourism operators, lodges, shuttles, and booking agents.',
    icon: Globe2,
    heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80',
    shortSummary: 'Compulsory registration for all tourism-related businesses operating in Namibia.',
    seo: {
      title: 'NTB Registration Services | Namibia Tourism Board Compliance',
      description: 'Register your tourism business with the Namibia Tourism Board (NTB). Mandatory for lodges, tour operators, and shuttles.',
      keywords: ['NTB registration', 'Namibia Tourism Board', 'tour operator license', 'lodge registration']
    },
    fullContent: {
      definition: `The Namibia Tourism Board (NTB) requires all businesses in the tourism sector to register and pay a levy. This ensures quality standards and protects the reputation of Namibia as a destination. Whether you run a B&B, a shuttle service, or a hunting farm, you need an NTB certificate.`,
      whoIsItFor: [
        'Accommodation establishments (Hotels, Lodges, B&Bs, Airbnbs).',
        'Tour and Safari Operators.',
        'Shuttle and Transport services.',
        'Booking Agents.',
        'Trophy Hunting Operators.'
      ],
      advantages: [
        '**Legal Requirement:** Mandatory to operate legally.',
        '**Marketing:** Listing in official NTB directories.',
        '**Visas:** Essential for supporting work visas for foreign specialist guides.'
      ],
      limitations: [
        '**Levies:** You must collect and pay tourism levies to the NTB.',
        '**Inspections:** Premises and vehicles are subject to physical inspection.'
      ],
      requirements: [
        'Company Registration Documents.',
        'Public Liability Insurance.',
        'Vehicle Roadworthiness Certificates (for transport).',
        'Health & Safety Compliance (Fitness Certificate from Municipality).',
        'Layout plans (for accommodation).'
      ],
      compliance: 'Annual renewal of registration and submission of levy returns.',
      whyChrimson: 'We navigate the dual bureaucracy of the Municipality (for fitness certificates) and the NTB to get your business green-lighted for tourists faster.'
    },
    relatedServices: ['private-company-pty-ltd']
  },
  {
    title: 'Tender Compliance',
    slug: 'tender-compliance',
    description: 'Good Standing packs (NAMRA, Social Security, BIPA, EEC) ready for government submission.',
    icon: Files,
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80',
    shortSummary: 'The complete document stack you need to bid for government and corporate tenders.',
    seo: {
      title: 'Tender Compliance Packs Namibia | Good Standing Certificates',
      description: 'Get "Tender Ready" with Chrimson. We collect your Good Standings from NAMRA, Social Security, BIPA, and Employment Equity.',
      keywords: ['Tender documents Namibia', 'Good Standing Certificate', 'NAMRA good standing', 'SSC good standing']
    },
    fullContent: {
      definition: `To bid on state tenders in Namibia, a company must prove it is a responsible corporate citizen. This is done by submitting a set of "Good Standing" certificates from various government bodies. If any one of these is missing or expired, your bid is automatically disqualified.`,
      whoIsItFor: [
        'Construction companies.',
        'Suppliers of goods and services to the government.',
        'Consulting firms.',
        'SMEs seeking procurement opportunities.'
      ],
      advantages: [
        '**Eligibility:** Opens the door to lucrative government contracts.',
        '**Reputation:** Proves your business is solvent and law-abiding.',
        '**Speed:** Having these ready allows you to react instantly when a bid is advertised.'
      ],
      limitations: [
        '**Validity:** Certificates expire quickly (usually 1-3 months).',
        '**Prerequisites:** You cannot get a Good Standing if you are in arrears with payments.'
      ],
      requirements: [
        '**BIPA Good Standing:** Proves annual duties are paid.',
        '**NAMRA Good Standing:** Proves tax returns and payments are up to date.',
        '**Social Security Good Standing:** Proves employee contributions are paid.',
        '**Employment Equity Certificate:** Required for companies with more than 25 employees.',
        '**SME Certificate:** From the Ministry of Industrialisation and Trade.'
      ],
      compliance: 'Requires constant monitoring of your tax and filing status. We recommend our "Annual Maintenance" retainer to keep you perpetually tender-ready.',
      whyChrimson: 'We run the lines for you. Our runners visit the revenue office and BIPA daily, resolving small blocks that would otherwise cause weeks of delay. We deliver the full pack to your desk, ready for submission.'
    },
    relatedServices: ['private-company-pty-ltd', 'namfisa-compliance']
  },
];

export interface PricingPackage extends PricingTier {
  saveAmount?: string;
  tagline?: string;
  ctaText?: string;
}

export const PRICING: PricingPackage[] = [
  {
    name: 'CC Starter',
    price: 'N$ 1,800',
    saveAmount: 'Save N$ 100',
    tagline: 'Perfect for small businesses',
    description: 'Get your Close Corporation running with essential licenses.',
    features: [
      'Close Corporation Registration',
      'BIPA Good Standing',
      'Municipal Trading License',
      'Basic Onboarding Guide',
      '7-14 Day Processing'
    ],
    recommended: false,
    ctaText: "Start Registration"
  },
  {
    name: 'Pty Ltd Professional',
    price: 'N$ 9,500',
    saveAmount: 'Save N$ 200',
    tagline: 'Complete setup for growth',
    description: 'Full Private Company registration with tax compliance.',
    features: [
      'Private Company Registration',
      'NAMRA Tax Good Standing',
      'BIPA Good Standing',
      'Share Certificates',
      'SME Certificate Assistance',
      '7-14 Day Processing'
    ],
    recommended: true,
    ctaText: "Start Registration"
  },
  {
    name: 'Tender-Ready',
    price: 'N$ 10,500',
    saveAmount: 'Save N$ 300',
    tagline: 'For government contracts',
    description: 'Everything you need to bid on state tenders immediately.',
    features: [
      'Private Company Registration',
      'Social Security Good Standing',
      'NAMRA Tax Good Standing',
      'Employment Equity Certificate',
      'SME Certificate',
      'BIPA Good Standing'
    ],
    recommended: false,
    ctaText: "Start Registration"
  },
  {
    name: 'Tourism Business',
    price: 'N$ 12,000',
    saveAmount: 'Save N$ 400',
    tagline: 'Lodges & Tour Operators',
    description: 'Full compliance for the Namibian tourism sector.',
    features: [
      'Private Company Registration',
      'NTB Registration',
      'Municipal Trading License',
      'SME Certificate',
      'BIPA Good Standing'
    ],
    recommended: false,
    ctaText: "Start Registration"
  },
];

export const TIMELINE: TimelineStep[] = [
  {
    title: 'Name Search & Reservation',
    description: 'We check availability and reserve your name with BIPA (2-5 days).',
    duration: 'Step 1',
  },
  {
    title: 'Legal Drafting',
    description: 'We draft your Memorandum, Articles, or Founding Statement.',
    duration: 'Step 2',
  },
  {
    title: 'Registry Filing',
    description: 'Documents are lodged at BIPA Windhoek. We handle all queuing.',
    duration: 'Step 3',
  },
  {
    title: 'Compliance Handover',
    description: 'Receive your Certificate of Incorporation and Good Standing docs.',
    duration: 'Step 4',
  },
];

export const FAQS: FaqItem[] = [
  {
    question: "Can I register a Sole Proprietorship?",
    answer: "No. Sole proprietorship structures have been discontinued for new registrations. We recommend registering a Close Corporation (CC) or Private Company (Pty Ltd) for better liability protection."
  },
  {
    question: "What is the difference between a CC and a Pty Ltd?",
    answer: "A CC has members and is simpler to run, ideal for small businesses. A Pty Ltd has shareholders and directors, allows for more owners, and is preferred for larger tenders and investment."
  },
  {
    question: "Do I need to be in Windhoek?",
    answer: "No. Chrimson Consultants operates digitally. We courier documents nationwide to Swakopmund, Walvis Bay, Oshakati, and beyond."
  },
];

export const WIZARD_DATA: WizardQuestion[] = [
  {
    id: 'q1',
    question: 'What is the primary goal of your new business?',
    options: [
      { label: 'Profit & Growth', value: 'profit', nextId: 'q2' },
      { label: 'Charity / Community', value: 'charity', recommendation: 'NPO (Section 21)' },
      { label: 'Government Tenders', value: 'tender', recommendation: 'Pty Ltd (Private Company)' },
    ]
  },
  {
    id: 'q2',
    question: 'How many owners will the business have?',
    options: [
      { label: '1 to 10 (Simple structure)', value: 'few', recommendation: 'Close Corporation (CC)' },
      { label: '1 to 50 (Scalable)', value: 'many', recommendation: 'Pty Ltd (Private Company)' },
    ]
  },
];

export const ORDER_PACKAGES: OrderPackage[] = [
  {
    id: 'pkg_cc',
    name: 'CC Starter',
    price: 1800,
    category: 'Registration',
    description: 'Small business essentials.',
    features: ['Close Corporation Registration', 'BIPA Good Standing', 'Municipal Trading License'],
    type: 'package',
    active: true
  },
  {
    id: 'pkg_pty',
    name: 'Pty Ltd Professional',
    price: 9500,
    category: 'Registration',
    description: 'Scalable company structure.',
    features: ['Pty Ltd Registration', 'NAMRA Tax Good Standing', 'BIPA Good Standing', 'SME Certificate'],
    type: 'package',
    active: true
  },
  {
    id: 'pkg_tender',
    name: 'Tender-Ready',
    price: 10500,
    category: 'Registration',
    description: 'All compliance docs for bidding.',
    features: ['Pty Ltd Registration', 'Social Security Good Standing', 'NAMRA Good Standing', 'Employment Equity', 'SME Certificate'],
    type: 'package',
    active: true
  },
  {
    id: 'pkg_tourism',
    name: 'Tourism Business',
    price: 12000,
    // Fix: 'Specialized' is not a valid ServiceCategory. Changed to 'Tourism'.
    category: 'Tourism',
    description: 'For lodges and tour operators.',
    features: ['Pty Ltd Registration', 'NTB Registration', 'Municipal License', 'SME Certificate'],
    type: 'package',
    active: true
  },
  {
    id: 'pkg_npo',
    name: 'NPO Registration',
    price: 8900,
    category: 'Registration',
    description: 'Section 21 Company for charities.',
    features: ['Section 21 Registration', 'Constitution Drafting', 'Auditor Appointment Letter'],
    type: 'package',
    active: true
  },
];

export const ORDER_ADDONS: OrderAddOn[] = [
  // Tender / Compliance
  // Fix: 'Tender' is not a valid ServiceCategory. Changed to 'Compliance'.
  { id: 'add_goodstanding_bipa', name: 'BIPA Good Standing', price: 650, description: 'Proof of annual duty payment.', category: 'Compliance', type: 'addon', active: true },
  { id: 'add_goodstanding_namra', name: 'NAMRA Good Standing', price: 850, description: 'Tax compliance certificate.', category: 'Compliance', type: 'addon', active: true },
  { id: 'add_goodstanding_ssc', name: 'Social Security Good Standing', price: 450, description: 'For employees.', category: 'Compliance', type: 'addon', active: true },
  { id: 'add_sme', name: 'SME Certificate', price: 500, description: 'Ministry of Trade certification.', category: 'Compliance', type: 'addon', active: true },
  { id: 'add_eec', name: 'Employment Equity', price: 950, description: 'Affirmative action compliance.', category: 'Compliance', type: 'addon', active: true },
  
  // Tourism
  { id: 'add_ntb', name: 'NTB Registration', price: 3500, description: 'Namibia Tourism Board application.', category: 'Tourism', type: 'addon', active: true },
  
  // Financial
  { id: 'add_namfisa', name: 'NAMFISA Registration', price: 12500, description: 'Microlender / Financial Service Provider.', category: 'Financial', type: 'addon', active: true },
  
  // General
  // Fix: 'General' is not a valid ServiceCategory. Changed to 'Regulatory'.
  { id: 'add_trade_license', name: 'Municipal Trading License', price: 450, description: 'Local authority fitness certificate.', category: 'Regulatory', type: 'addon', active: true },
];
