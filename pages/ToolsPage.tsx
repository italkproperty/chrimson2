import React from 'react';
import { BusinessWizard } from '../components/BusinessWizard';
import { ConsultantAI } from '../components/ConsultantAI';
import { NameAvailabilityTool, TenderReadinessTool, ComplianceListTool } from '../components/tools/BusinessTools';

export const ToolsPage: React.FC = () => {
  return (
    <div className="pt-24 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Business Tools</h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Smart utilities to help you plan your compliance journey. Use these tools to check availability, assess readiness, and estimate costs.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
           <NameAvailabilityTool />
           <TenderReadinessTool />
           <ComplianceListTool />
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-24"></div>

        {/* Main Wizard */}
        <div className="mb-24">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Structure Recommender</h2>
              <p className="text-slate-500">Not sure if you need a Pty Ltd or an NPO? Let our AI help.</p>
           </div>
           <BusinessWizard />
        </div>

        {/* Consultant Chat */}
        <ConsultantAI />
      </div>
    </div>
  );
};