type LoaderProps = {
  label: string;
  showLabel?: boolean;
};

function Loader({ label, showLabel = true }: LoaderProps) {
  return (
    <span className="loader" role="status" aria-label={label}>
      <span className="loader__spinner" aria-hidden="true" />
      <span className={showLabel ? undefined : "visually-hidden"}>{label}</span>
    </span>
  );
}

export default Loader;
