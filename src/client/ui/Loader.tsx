type LoaderProps = {
  label: string;
  showLabel?: boolean;
};

function Loader({ label, showLabel = true }: LoaderProps) {
  return (
    <span className="loading-indicator" role="status" aria-label={label}>
      <span className="loading-spinner" aria-hidden="true" />
      <span className={showLabel ? undefined : "sr-only"}>{label}</span>
    </span>
  );
}

export default Loader;
