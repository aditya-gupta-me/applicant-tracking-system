import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@repo/ui/components/button";

type Job = {
    id: string;
    title: string;
    description: string;
    location: string | null;
    type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "TEMPORARY";
    applyBy: string | null;
    startDate: string | null;
    department: {
        name: string;
    };
    jobSkills: Array<{
        isRequired: boolean;
        skill: {
            id: string;
            name: string;
        };
    }>;
};

const jobTypeLabels: Record<Job["type"], string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    TEMPORARY: "Temporary",
};

function formatDate(value: string | null) {
    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? null
        : new Intl.DateTimeFormat("en", {
              dateStyle: "long",
          }).format(date);
}

async function getJob(id: string): Promise<Job> {
    const response = await fetch(`http://localhost:3000/api/public/jobs/${encodeURIComponent(id)}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Unable to load job posting (${response.status})`);
    }

    const data: { job: Job | null } = await response.json();
    if (!data.job) notFound();

    return data.job;
}

function JobPageFallback() {
    return (
        <div className="bg-muted/30">
            <section className="border-b border-border bg-background">
                <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
                    <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                    <div className="mt-10 max-w-3xl">
                        <div className="size-12 animate-pulse rounded-2xl bg-muted" />
                        <div className="mt-6 h-4 w-32 animate-pulse rounded bg-muted" />
                        <div className="mt-3 h-12 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="mt-6 h-5 w-2/3 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            </section>
            <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-14">
                <div className="h-[34rem] animate-pulse rounded-2xl border border-border bg-background" />
                <div className="h-64 animate-pulse rounded-2xl border border-border bg-background" />
            </main>
        </div>
    );
}

async function JobPageContent({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const job = await getJob(id);
    const applyBy = formatDate(job.applyBy);
    const startDate = formatDate(job.startDate);
    const requiredSkills = job.jobSkills.filter(({ isRequired }) => isRequired);
    const additionalSkills = job.jobSkills.filter(({ isRequired }) => !isRequired);

    return (
        <div className="bg-muted/30">
            <section className="border-b border-border bg-background">
                <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Back to open positions
                    </Link>
                    <div className="mt-10 max-w-3xl">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <BriefcaseBusiness aria-hidden="true" className="size-6" />
                        </div>
                        <p className="mt-6 text-sm font-medium text-primary">{job.department.name}</p>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{job.title}</h1>
                        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                                <BriefcaseBusiness aria-hidden="true" className="size-4" />
                                {jobTypeLabels[job.type]}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <MapPin aria-hidden="true" className="size-4" />
                                {job.location ?? "Location not specified"}
                            </span>
                            {applyBy && (
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays aria-hidden="true" className="size-4" />
                                    Apply by {applyBy}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-14">
                <article className="rounded-2xl border border-border bg-background p-6 shadow-sm md:p-10">
                    <section>
                        <h2 className="text-xl font-semibold">About the role</h2>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                            {job.description}
                        </p>
                    </section>

                    {job.jobSkills.length > 0 && (
                        <section className="mt-10 border-t border-border pt-10">
                            <h2 className="text-xl font-semibold">What you&apos;ll bring</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Skills and experience that will help you succeed in this role.
                            </p>
                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {job.jobSkills.map(({ skill, isRequired }) => (
                                    <div key={skill.id} className="flex items-start gap-3 rounded-xl border border-border p-4">
                                        <CheckCircle2
                                            aria-hidden="true"
                                            className={`mt-0.5 size-5 shrink-0 ${isRequired ? "text-primary" : "text-muted-foreground"}`}
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{skill.name}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {isRequired ? "Required" : "Nice to have"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(startDate || applyBy) && (
                        <section className="mt-10 border-t border-border pt-10">
                            <h2 className="text-xl font-semibold">Important dates</h2>
                            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                                {startDate && (
                                    <div className="rounded-xl bg-muted p-4">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Expected start
                                        </dt>
                                        <dd className="mt-1 text-sm font-medium">{startDate}</dd>
                                    </div>
                                )}
                                {applyBy && (
                                    <div className="rounded-xl bg-muted p-4">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Application deadline
                                        </dt>
                                        <dd className="mt-1 text-sm font-medium">{applyBy}</dd>
                                    </div>
                                )}
                            </dl>
                        </section>
                    )}
                </article>

                <aside className="lg:sticky lg:top-6 lg:self-start">
                    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                        <h2 className="text-lg font-semibold">Interested in this role?</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Sign in or create an account to submit your application.
                        </p>
                        <Button className="mt-6 w-full" render={<Link href="/login" />} nativeButton={false}>
                            Apply for this role
                        </Button>
                        <p className="mt-4 text-center text-xs text-muted-foreground">
                            {applyBy ? `Applications are open until ${applyBy}.` : "Applications are currently open."}
                        </p>
                    </div>
                    <div className="mt-4 rounded-2xl border border-border bg-background p-6">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role overview</p>
                        <dl className="mt-4 space-y-4 text-sm">
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">Department</dt>
                                <dd className="text-right font-medium">{job.department.name}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">Required skills</dt>
                                <dd className="font-medium">{requiredSkills.length}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">Additional skills</dt>
                                <dd className="font-medium">{additionalSkills.length}</dd>
                            </div>
                        </dl>
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default function JobPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense fallback={<JobPageFallback />}>
            <JobPageContent params={params} />
        </Suspense>
    );
}