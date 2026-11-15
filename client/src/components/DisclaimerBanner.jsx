import React from 'react';
import { AlertCircle } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-center gap-2 select-none shadow-sm">
      <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
      <span className="font-medium">
        <strong>CLINICAL DISCLAIMER:</strong> Simulated data for demonstration only. Not for real medical use. Built for NASA Space Apps Challenge 2026.
      </span>
    </div>
  );
}
