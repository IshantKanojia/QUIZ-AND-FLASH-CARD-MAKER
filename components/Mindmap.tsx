
import React from 'react';
import { MindMapNode } from '../types';

interface MindMapViewProps {
  node: MindMapNode;
  isRoot?: boolean;
  level?: number;
}

export const MindMapView: React.FC<MindMapViewProps> = ({ node, isRoot = true, level = 0 }) => {
  const levelStyles: { [key: number]: string } = {
    0: 'text-xl font-bold text-sky-600 dark:text-sky-400',
    1: 'text-lg font-semibold text-slate-800 dark:text-slate-200',
    2: 'text-base font-medium text-slate-700 dark:text-slate-300',
  };

  const defaultStyle = 'text-sm text-slate-600 dark:text-slate-400';
  
  return (
    <div className={`${!isRoot ? 'pl-6' : ''}`}>
      <div className="relative">
        {!isRoot && (
          <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-400 dark:bg-slate-500"></span>
        )}
        <p className={`${levelStyles[level] || defaultStyle}`}>{node.topic}</p>
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="mt-2 space-y-2 pl-4 border-l border-slate-300 dark:border-slate-600">
          {node.children.map((child, index) => (
            <li key={index}>
              <MindMapView node={child} isRoot={false} level={level + 1} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
