// Consistent loading indicator for any page/section fetching data.
// A subtle pulse rather than a spinner — matches the flat, printed-page
// feel of the rest of the app instead of introducing a spinning icon.
export default function LoadingState({
  label = "Loading…",
}: {
  label?: string;
}) {
  return (
    <p className="animate-pulse py-12 text-center font-base text-foreground/70">
      {label}
    </p>
  );
}
