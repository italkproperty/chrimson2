import React from 'react';
import { motion } from 'framer-motion';

export const RefundPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate dark:prose-invert max-w-none"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">Refund & Cancellation Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: October 2024</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">1. Cancellation of Orders</h2>
            <p>
              Clients may request a cancellation of their order within 24 hours of purchase, provided that Chrimson Consultants has not yet begun the drafting or filing process with the relevant government body.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">2. Eligibility for Refunds</h2>
            <p>Refunds are only considered under the following conditions:</p>
            <ul>
              <li><strong>Duplicate Payment:</strong> If a client accidentally pays twice for the same service.</li>
              <li><strong>Inability to Perform:</strong> If Chrimson Consultants is unable to fulfill the service due to internal reasons.</li>
              <li><strong>Pre-Processing:</strong> If a cancellation is requested before any work has commenced.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">3. Non-Refundable Items</h2>
            <p>
              Once a name reservation is submitted to BIPA or any official government application is lodged, the associated service fees and statutory government fees are non-refundable.
            </p>
            <p>
              Administrative fees for work already performed (drafting of constitutions, etc.) will be deducted from any eligible refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">4. Refund Process</h2>
            <p>
              Refund requests must be submitted in writing to <strong>hello@chrimsoncc.com</strong> with the order reference number. Approved refunds will be processed via the original payment method through the DPO gateway within 7-10 working days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">5. Chargebacks</h2>
            <p>
              Clients are encouraged to contact Chrimson Consultants directly to resolve any billing disputes before initiating a chargeback through their bank. Unauthorized chargebacks may lead to the suspension of active registration services.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};