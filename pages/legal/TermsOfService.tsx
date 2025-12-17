import React from 'react';
import { motion } from 'framer-motion';

export const TermsOfService: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate dark:prose-invert max-w-none"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: October 2024</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the services of Chrimson Consultants ("the Company", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">2. Description of Services</h2>
            <p>
              Chrimson Consultants provides professional business registration and compliance advisory services in Namibia. This includes but is not limited to:
            </p>
            <ul>
              <li>Company Registration (Pty Ltd, CC, NPO)</li>
              <li>Regulatory Compliance Filings (NAMFISA, NTB)</li>
              <li>Good Standing Certificate procurement</li>
              <li>Business Consultation and Structural Advice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">3. Payment & Security</h2>
            <p>
              All payments for services are processed through Direct Pay Online (DPO Group), a secure PCI DSS compliant payment gateway. By proceeding with a purchase, you consent to the processing of your payment data by DPO Group.
            </p>
            <p>
              Prices are listed in Namibian Dollars (NAD) unless otherwise specified. Full payment is required before any registration or filing process begins.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">4. User Responsibilities</h2>
            <p>
              Users are responsible for providing accurate, complete, and truthful information required for registrations. Chrimson Consultants is not liable for delays or rejections caused by inaccurate data provided by the client.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">5. Limitation of Liability</h2>
            <p>
              While we maintain a high success rate, Chrimson Consultants acts as an administrative liaison. We do not guarantee approval by government bodies (BIPA, NAMRA, SSC, etc.), as approval remains at the sole discretion of the respective Namibian authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">6. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of the Republic of Namibia. Any disputes shall be subject to the exclusive jurisdiction of the courts in Windhoek, Namibia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">7. Contact Information</h2>
            <p>
              For legal inquiries or dispute resolution, please contact:
              <br />
              <strong>Chrimson Consultants</strong>
              <br />
              77 Independence Avenue, Windhoek, Namibia
              <br />
              Email: hello@chrimsoncc.com
              <br />
              Phone: +264 81 712 1176
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};