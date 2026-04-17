import { useUIStore } from '@/store/uiStore';

export default function Toast() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-4 flex flex-col gap-2 z-50"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            toast show bg-gray-800 text-white text-sm py-2 px-4 rounded-md flex items-center gap-2
            ${toast.type === 'success' ? 'border-l-4 border-green-500' : ''}
            ${toast.type === 'error' ? 'border-l-4 border-red-500' : ''}
            ${toast.type === 'info' ? 'border-l-4 border-blue-500' : ''}
          `}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-gray-400 hover:text-white"
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
