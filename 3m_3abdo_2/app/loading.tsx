import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mx-auto mb-4" />
        <h5 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Loading catalog...</h5>
      </div>
    </div>
  );
}
