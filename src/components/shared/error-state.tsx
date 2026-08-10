interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 px-6 py-14 text-center dark:border-red-900 dark:bg-red-950/20">
      <p className="text-base font-medium text-red-700 dark:text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}