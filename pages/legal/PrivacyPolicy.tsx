import React from 'react';
import { motion } from 'framer-motion';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate dark:prose-invert max-w-none"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Effective Date: October 2024</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">1. Information We Collect</h2>
            <p>We collect information necessary to perform business registration and compliance services, including:</p>
            <ul>
              <li><strong>Personal Identification:</strong> Full name, ID/Passport copies, and contact details.</li>
              <li><strong>Business Information:</strong> Proposed business names, shareholder details, and physical addresses.</li>
              <li><strong>Payment Information:</strong> Credit card details and billing addresses (processed securely via DPO).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">2. How We Use Your Data</h2>
            <p>Your data is used exclusively for:</p>
            <ul>
              <li>Executing your registration requests with Namibian authorities (BIPA, NAMRA, etc.).</li>
              <li>Processing secure payments through our payment partner, DPO.</li>
              <li>Communicating project updates and compliance reminders.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">3. Data Sharing and Third Parties</h2>
            <p>
              We do not sell your personal data. We only share information with authorized government bodies in Namibia and our secure payment provider (DPO Group) as required to fulfill our service obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">4. Data Security</h2>
            <p>
              Chrimson Consultants employs industry-standard security measures to protect your documents and data. All payment transactions are encrypted via SSL and processed through PCI DSS Level 1 certified gateways provided by DPO.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or request the deletion of your personal data held by us, subject to Namibian statutory record-keeping requirements for corporate filings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">6. Cookies</h2>
            <p>
              Our website uses cookies to enhance user experience and analyze traffic. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">7. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please email us at <a href="mailto:hello@chrimsoncc.com" className="text-chrimson-600">hello@chrimsoncc.com</a>.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};