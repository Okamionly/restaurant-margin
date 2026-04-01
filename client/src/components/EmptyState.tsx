import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-slate-500 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="
            inline-flex items-center gap-2 py-2 px-4 text-sm font-medium
            bg-teal-600 hover:bg-teal-500 text-white rounded-xl
            transition-colors duration-150 cursor-pointer
          "
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
