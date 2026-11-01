import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import type { JobPostingCardData, JobTypeValue } from "@repo/schema";

const jobTypeLabels: Record<JobTypeValue, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
};

function formatDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

type JobPostingCardProps = {
  job: JobPostingCardData;
};

export function JobPostingCard({ job }: JobPostingCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BriefcaseBusiness aria-hidden="true" className="size-5" />
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          Open
        </span>
      </div>
      <h2 className="mt-6 text-lg font-semibold">{job.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{job.departmentName}</p>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{job.description}</p>
      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <BriefcaseBusiness className="size-4" aria-hidden="true" />
          {jobTypeLabels[job.type]}
        </span>
        {job.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            {job.location}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-4" aria-hidden="true" />
          {job.applyBy ? `Apply by ${formatDate(job.applyBy) ?? "unknown date"}` : "No closing date"}
        </span>
      </div>
      <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
        {job.skills.length} {job.skills.length === 1 ? "skill" : "skills"} selected
      </div>
      {job.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span key={skill.id} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {skill.name}{skill.isRequired ? " · Required" : ""}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
