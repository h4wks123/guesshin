type ErrorBannerProps = {
  error?: string;
  canRetry: boolean;
  onRetry: () => void;
};

function ErrorBanner({ error, canRetry, onRetry }: ErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="error-banner" role="alert">
      <span>{error}</span>
      {canRetry && (
        <button
          type="button"
          className="button button--danger error-banner__retry"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorBanner;
