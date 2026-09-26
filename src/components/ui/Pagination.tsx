import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4 text-sm">
      <Button
        variant="neutral"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>
      <span className="font-base text-foreground/70">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="neutral"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}
