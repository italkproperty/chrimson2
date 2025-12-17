import React from 'react';
import { motion } from 'framer-motion';

export const Disclaimer: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate dark:prose-invert max-w-none"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">Disclaimer</h1>
          
          <section className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-0">General Information</h2>
            <p>
              The information provided on the Chrimson Consultants website (chrimsoncc.com) is for general informational purposes only and does not constitute legal or financial advice. While we strive to keep information accurate and up-to-date, we make no representations or warranties of any kind regarding the completeness or reliability of the information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Professional Relationship</h2>
            <p>
              Use of this website or submission of an inquiry does not create a consultant-client relationship. Such a relationship is only established once an order is confirmed and payment is received.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Government Agency Delays</h2>
            <p>
              Chrimson Consultants acts as an intermediary. We are not responsible for delays caused by government agencies (BIPA, NAMRA, Ministry of Home Affairs, etc.), industrial actions, system failures at government registries, or changes in Namibian legislation that may affect processing times or requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">External Links</h2>
            <p>
              Our website may contain links to third-party websites (e.g., DPO Group, BIPA). We have no control over the content or privacy practices of these sites and assume no responsibility for them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Limitation of Liability</h2>
            <p>
              In no event shall Chrimson Consultants be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, arising from loss of data or profits arising out of, or in connection with, the use of this website or our services.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};