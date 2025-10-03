import React from 'react';
import { OutputType } from '../types';
import { OUTPUT_TYPES } from '../constants';

interface OutputTypeSelectorProps {
  selectedOutputs: Set<OutputType>;
  onToggle: (outputType: OutputType) => void;
}

export const OutputTypeSelector: React.FC<OutputTypeSelectorProps> = ({ selectedOutputs, onToggle }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center">2. Choose Your Study Aids</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
        {OUTPUT_TYPES.map(({ id, label, icon: Icon, description }) => (
          <div
            key={id}
            onClick={() => onToggle(id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex flex-col ${
              selectedOutputs.has(id)
                ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 ring-2 ring-sky-500'
                : 'border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-600 bg-white dark:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className={`w-6 h-6 ${selectedOutputs.has(id) ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`} />
              <h4 className="font-bold text-slate-800 dark:text-slate-100">{label}</h4>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};