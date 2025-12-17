import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { db } from '../../services/mockDb';
import { usePricing } from '../../contexts/PricingContext';
import { FinancialDoc, InvoiceItem, PaymentRecord, Currency, PaymentMethod } from '../../types';
import { 
  Plus, Trash2, Save, Download, Send, RefreshCw, Calendar as CalendarIcon, 
  FileText, FileSpreadsheet, Percent, RotateCw, ChevronDown, ChevronUp, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InvoiceBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, convertPrice, currency: globalCurrency } = usePricing();
  const [loading, setLoading] = useState(false);
  
  // Determine Mode based on URL path
  const isInvoice = location.pathname.includes('invoices');
  const docType = isInvoice ? 'invoice' : 'quotation';

  // --- State Management ---
  
  // Document
  const [docNumber, setDocNumber] = useState('');
  const [status, setStatus] = useState<string>('draft');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(''); 
  const [validUntil, setValidUntil] = useState(''); 
  const [docCurrency, setDocCurrency] = useState<Currency>(globalCurrency); // Local state for document currency

  // Client
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientVatNo, setClientVatNo] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  // Financials
  const [vatEnabled, setVatEnabled] = useState(false);
  const [vatRate] = useState(0.15);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);

  // Extras
  const [internalNotes, setInternalNotes] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [deliverables, setDeliverables] = useState('');
  
  // Payments (Invoice Only)
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Sections State
  const [openSections, setOpenSections] = useState({
     client: true,
     details: true,
     items: true,
     notes: true,
     payments: false,
     terms: false
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Initialization ---

  useEffect(() => {
    // Generate ID on mount
    const prefix = isInvoice ? 'INV' : 'QUO';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setDocNumber(`${prefix}-${year}-${random}`);
    
    // Set default status
    setStatus(isInvoice ? 'pending' : 'sent');
  }, [isInvoice]);


  // --- Calculations ---

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    let discountAmount = 0;
    if (discountType === 'percent') {
       discountAmount = subtotal * (discountValue / 100);
    } else {
       discountAmount = discountValue;
    }

    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const vatAmount = vatEnabled ? afterDiscount * vatRate : 0;
    const total = afterDiscount + vatAmount;

    return { subtotal, discountAmount, vatAmount, total };
  };

  const totals = calculateTotals();


  // --- Handlers ---

  const handleProductSelect = (id: string, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Convert price if doc currency differs from base NAD
    // Note: convertPrice uses globalCurrency from context, we need custom logic if docCurrency differs
    // Simple mock logic:
    const rates = db.getExchangeRates();
    const rate = rates[docCurrency]; 
    const convertedPrice = Number((product.price * rate).toFixed(2));

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          description: product.name, 
          unitPrice: convertedPrice,
          total: item.quantity * convertedPrice
        };
      }
      return item;
    }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
            updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
        setItems(items.filter(i => i.id !== id));
    }
  };

  const addPayment = () => {
     const newPayment: PaymentRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        method: 'EFT'
     };
     setPayments([...payments, newPayment]);
     if (!openSections.payments) toggleSection('payments');
  };

  const updatePayment = (id: string, field: keyof PaymentRecord, value: any) => {
     setPayments(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePayment = (id: string) => {
     setPayments(prev => prev.filter(p => p.id !== id));
  };

  const convertToInvoice = () => {
     if(!window.confirm("Convert this quotation to a new invoice?")) return;
     alert("In a real app, this would carry over data to /invoices/new");
  };

  const handleSave = () => {
    if (!clientName) return alert('Client Name is required');
    
    setLoading(true);
    
    const newDoc: FinancialDoc = {
      id: Date.now().toString(),
      type: docType,
      number: docNumber,
      clientName,
      clientCompany,
      clientEmail,
      clientPhone,
      clientVatNo,
      clientAddress,
      
      items,
      currency: docCurrency,
      subtotal: totals.subtotal,
      vatRate: vatEnabled ? vatRate : 0,
      vatAmount: totals.vatAmount,
      discountAmount: totals.discountAmount,
      total: totals.total,
      
      issueDate,
      dueDate: isInvoice ? dueDate : undefined,
      validUntil: !isInvoice ? validUntil : undefined,
      status: status as any,
      
      paymentHistory: isInvoice ? payments : undefined,
      terms: !isInvoice ? terms : undefined,
      deliverables: !isInvoice ? deliverables : undefined,
      
      notes: clientNotes,
      internalNotes
    };

    setTimeout(() => {
      db.createFinancialDoc(newDoc);
      setLoading(false);
      navigate(isInvoice ? '/admin/dashboard/invoices' : '/admin/dashboard/quotations');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Breadcrumbs items={[
          { label: 'Financials', href: '/admin/dashboard' }, 
          { label: isInvoice ? 'Invoices' : 'Quotations', href: isInvoice ? '/admin/dashboard/invoices' : '/admin/dashboard/quotations' },
          { label: `New ${isInvoice ? 'Invoice' : 'Quotation'}` }
        ]} />

        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 capitalize">
               {isInvoice ? <FileText size={32} className="text-chrimson-600"/> : <FileSpreadsheet size={32} className="text-blue-600"/>}
               Create {docType}
             </h1>
             <p className="text-slate-500 text-sm mt-1">
               {isInvoice ? 'Bill clients for services.' : 'Send a proposal for approval.'}
             </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => navigate(-1)} className="bg-white">Cancel</Button>
             <Button onClick={handleSave} disabled={loading} className={!isInvoice ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                {loading ? <RefreshCw className="animate-spin mr-2" size={16}/> : <Save className="mr-2" size={16}/>}
                Save {docType}
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Client Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('client')}>
                  <h3 className="font-bold text-slate-700 text-sm uppercase">Client Details</h3>
                  {openSections.client ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
               </div>
               {openSections.client && (
                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Client Name *</label>
                       <input className="w-full input-field" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Contact Person" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                       <input className="w-full input-field" value={clientCompany} onChange={e => setClientCompany(e.target.value)} placeholder="Business Name" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                       <input className="w-full input-field" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@domain.com" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                       <input className="w-full input-field" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="+264..." />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">VAT Number</label>
                       <input className="w-full input-field" value={clientVatNo} onChange={e => setClientVatNo(e.target.value)} placeholder="Optional" />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Physical Address</label>
                       <textarea className="w-full input-field h-20" value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="Street Address..." />
                    </div>
                 </div>
               )}
            </div>

            {/* 2. Document Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('details')}>
                  <h3 className="font-bold text-slate-700 text-sm uppercase">Document Details</h3>
                  {openSections.details ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
               </div>
               {openSections.details && (
                 <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">{docType} Number</label>
                       <div className="relative">
                          <input className="w-full input-field pl-10" value={docNumber} onChange={e => setDocNumber(e.target.value)} />
                          <RotateCw size={14} className="absolute left-3 top-3 text-slate-400 cursor-pointer" onClick={() => setDocNumber(`${isInvoice ? 'INV' : 'QUO'}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`)} />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Issue Date</label>
                       <input type="date" className="w-full input-field" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">{isInvoice ? 'Due Date' : 'Valid Until'}</label>
                       <input type="date" className="w-full input-field" value={isInvoice ? dueDate : validUntil} onChange={e => isInvoice ? setDueDate(e.target.value) : setValidUntil(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Currency</label>
                       <select className="w-full input-field" value={docCurrency} onChange={e => setDocCurrency(e.target.value as Currency)}>
                          <option value="NAD">NAD (N$)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="ZAR">ZAR (R)</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                       <select className="w-full input-field" value={status} onChange={e => setStatus(e.target.value)}>
                          {isInvoice ? (
                            <>
                              <option value="draft">Draft</option>
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="overdue">Overdue</option>
                            </>
                          ) : (
                             <>
                              <option value="draft">Draft</option>
                              <option value="sent">Sent</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </>
                          )}
                       </select>
                    </div>
                 </div>
               )}
            </div>

            {/* 3. Line Items */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('items')}>
                  <h3 className="font-bold text-slate-700 text-sm uppercase">Line Items</h3>
                  {openSections.items ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
               </div>
               {openSections.items && (
                 <div className="p-6">
                    <div className="space-y-3 mb-6">
                       {/* Header Row */}
                       <div className="grid grid-cols-12 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
                          <div className="col-span-6">Description</div>
                          <div className="col-span-2">Qty</div>
                          <div className="col-span-2">Price</div>
                          <div className="col-span-2 text-right">Total</div>
                       </div>
                       
                       <AnimatePresence>
                         {items.map((item) => (
                           <motion.div 
                             key={item.id}
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             className="grid grid-cols-12 gap-4 items-center group p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
                           >
                              <div className="col-span-6">
                                 <div className="flex flex-col gap-2">
                                    <select 
                                      className="text-xs bg-slate-100 border border-slate-200 rounded px-2 py-1 w-full outline-none focus:ring-1 focus:ring-chrimson-500"
                                      onChange={(e) => handleProductSelect(item.id, e.target.value)}
                                      defaultValue=""
                                    >
                                       <option value="" disabled>Select Product (Optional)</option>
                                       {products.map(p => (
                                          <option key={p.id} value={p.id}>{p.name}</option>
                                       ))}
                                    </select>
                                    <input 
                                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-900 placeholder-slate-400"
                                      placeholder="Item description"
                                      value={item.description}
                                      onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                                    />
                                 </div>
                              </div>
                              <div className="col-span-2">
                                 <input 
                                   type="number" min="1"
                                   className="w-full bg-transparent border-b border-slate-200 p-1 focus:border-chrimson-500 focus:outline-none text-sm"
                                   value={item.quantity}
                                   onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                 />
                              </div>
                              <div className="col-span-2">
                                 <input 
                                   type="number" min="0"
                                   className="w-full bg-transparent border-b border-slate-200 p-1 focus:border-chrimson-500 focus:outline-none text-sm"
                                   value={item.unitPrice}
                                   onChange={e => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                 />
                              </div>
                              <div className="col-span-2 flex items-center justify-end gap-3">
                                 <span className="text-sm font-bold text-slate-700">
                                    {docCurrency} {item.total.toLocaleString()}
                                 </span>
                                 <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </motion.div>
                         ))}
                       </AnimatePresence>
                    </div>
                    <Button variant="ghost" size="sm" onClick={addItem} className="w-full border border-dashed border-slate-300 text-slate-500 hover:border-chrimson-300 hover:text-chrimson-600 hover:bg-white">
                       <Plus size={16} className="mr-2" /> Add Line Item
                    </Button>
                 </div>
               )}
            </div>

            {/* 4. Extra Sections (Quote Only) */}
            {!isInvoice && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('terms')}>
                    <h3 className="font-bold text-slate-700 text-sm uppercase">Terms & Deliverables</h3>
                    {openSections.terms ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                 </div>
                 {openSections.terms && (
                   <div className="p-6 space-y-4">
                      <div className="space-y-1">
                         <label className="text-xs font-bold text-slate-500 uppercase">Deliverables</label>
                         <textarea className="w-full input-field h-24" value={deliverables} onChange={e => setDeliverables(e.target.value)} placeholder="List deliverables..." />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs font-bold text-slate-500 uppercase">Terms & Conditions</label>
                         <textarea className="w-full input-field h-24" value={terms} onChange={e => setTerms(e.target.value)} placeholder="Enter T&Cs..." />
                      </div>
                   </div>
                 )}
              </div>
            )}
            
            {/* 5. Payments (Invoice Only) */}
            {isInvoice && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('payments')}>
                    <h3 className="font-bold text-slate-700 text-sm uppercase">Payment Log</h3>
                    {openSections.payments ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                 </div>
                 {openSections.payments && (
                    <div className="p-6">
                       {payments.length > 0 && (
                          <div className="space-y-2 mb-4">
                             {payments.map(pay => (
                                <div key={pay.id} className="flex gap-4 items-center bg-slate-50 p-2 rounded border border-slate-100">
                                   <input type="date" value={pay.date} onChange={e => updatePayment(pay.id, 'date', e.target.value)} className="bg-transparent text-sm border-b border-slate-300 w-32" />
                                   <select value={pay.method} onChange={e => updatePayment(pay.id, 'method', e.target.value)} className="bg-transparent text-sm border-b border-slate-300">
                                      <option value="EFT">EFT</option>
                                      <option value="PayToday">PayToday</option>
                                      <option value="Cash">Cash</option>
                                      <option value="POS">POS</option>
                                   </select>
                                   <input type="number" value={pay.amount} onChange={e => updatePayment(pay.id, 'amount', parseFloat(e.target.value))} className="bg-transparent text-sm font-bold border-b border-slate-300 w-24" />
                                   <button onClick={() => removePayment(pay.id)}><Trash2 size={14} className="text-red-400"/></button>
                                </div>
                             ))}
                          </div>
                       )}
                       <Button size="sm" variant="ghost" onClick={addPayment}>+ Log Payment</Button>
                    </div>
                 )}
              </div>
            )}

            {/* 6. Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('notes')}>
                  <h3 className="font-bold text-slate-700 text-sm uppercase">Notes</h3>
                  {openSections.notes ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
               </div>
               {openSections.notes && (
                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Client Notes (Visible)</label>
                       <textarea className="w-full input-field h-24" value={clientNotes} onChange={e => setClientNotes(e.target.value)} placeholder="Thank you for your business..." />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Internal Notes (Hidden)</label>
                       <textarea className="w-full input-field h-24" value={internalNotes} onChange={e => setInternalNotes(e.target.value)} placeholder="Admin only details..." />
                    </div>
                 </div>
               )}
            </div>

          </div>

          {/* RIGHT COLUMN: Summary & Actions */}
          <div className="space-y-6">
             
             {/* Totals Card */}
             <div className="bg-slate-900 p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                   Summary ({docCurrency})
                </h3>
                <div className="space-y-3 mb-6">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Subtotal</span>
                      <span>{totals.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                   </div>
                   
                   {/* Discount */}
                   <div className="flex justify-between text-sm items-center">
                      <div className="flex items-center gap-2">
                         <span className="text-slate-300">Discount</span>
                         <select className="bg-slate-800 border-none text-xs rounded px-1 py-0.5 text-slate-300" value={discountType} onChange={e => setDiscountType(e.target.value as any)}>
                            <option value="fixed">Fixed</option>
                            <option value="percent">%</option>
                         </select>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-slate-500">-</span>
                         <input 
                           type="number" min="0"
                           className="w-16 bg-slate-800 border-none rounded px-2 py-1 text-right text-white text-sm"
                           value={discountValue}
                           onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                         />
                      </div>
                   </div>

                   {/* VAT */}
                   <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-300">VAT (15%)</span>
                      <div className="flex items-center gap-2">
                        <div 
                          onClick={() => setVatEnabled(!vatEnabled)}
                          className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${vatEnabled ? 'bg-chrimson-600' : 'bg-slate-700'}`}
                        >
                           <div className={`w-3 h-3 rounded-full bg-white transition-transform ${vatEnabled ? 'translate-x-4' : ''}`}></div>
                        </div>
                        <span className={!vatEnabled ? 'text-slate-600' : ''}>{totals.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                      </div>
                   </div>

                   <div className="h-px bg-white/10 my-3"></div>
                   
                   <div className="flex justify-between items-baseline">
                      <span className="text-sm font-medium text-slate-300">Total</span>
                      <span className="text-2xl font-bold text-white">{docCurrency} {totals.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <Button variant="secondary" size="sm" className="w-full bg-white/10 hover:bg-white/20 border-none text-xs">
                      <Download size={14} className="mr-2" /> PDF
                   </Button>
                   <Button variant="secondary" size="sm" className="w-full bg-white/10 hover:bg-white/20 border-none text-xs">
                      <Send size={14} className="mr-2" /> Email
                   </Button>
                   <Button variant="secondary" size="sm" className="w-full bg-white/10 hover:bg-white/20 border-none text-xs col-span-2">
                      <Copy size={14} className="mr-2" /> Duplicate
                   </Button>
                </div>
                {!isInvoice && (
                  <Button onClick={convertToInvoice} variant="primary" size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-xs">
                    Convert to Invoice
                  </Button>
                )}
             </div>

             {/* Quick Actions / Tips */}
             <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Tips</h4>
                <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                   <li>Ensure client VAT number is correct for tax invoices.</li>
                   <li>You can drag and drop line items to reorder (Coming Soon).</li>
                   <li>Internal notes are never shown to the client.</li>
                </ul>
             </div>
          </div>
        </div>

        <style>{`
          .input-field {
             @apply px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-chrimson-500/20 focus:border-chrimson-500 outline-none text-sm transition-all;
          }
        `}</style>
      </div>
    </div>
  );
};