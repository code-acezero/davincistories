type Status = "draft" | "review" | "published";

const styles: Record<Status, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  review: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  published: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const StatusBadge = ({ status }: { status: Status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider border ${styles[status]}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {status}
  </span>
);

export default StatusBadge;
