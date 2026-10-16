import { useSession } from "@repo/auth";
import { BriefcaseBusiness, Building2, CalendarDays, LayoutDashboard, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@repo/ui/components/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";

type JobPostingSummary = {
    id: string;
    title: string;
    departmentName: string;
    location: string | null;
    type: "FULL_TIME" | "INTERNSHIP" | "CONTRACT" | "PART_TIME" | "TEMPORARY";
    applyBy: string | null;
    skillCount: number;
};

const jobTypeLabels: Record<JobPostingSummary["type"], string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    TEMPORARY: "Temporary",
};

export default function JobPosting() {
    const { data: session } = useSession();
    const user = session?.user;

    // Replace this with the organization-scoped job postings API response.
    const jobPostings: JobPostingSummary[] = [];

    if (!user) {
        return null;
    }

    return (
        <SidebarProvider>
            <AppSidebar
                user={{ name: user.name, email: user.email }}
                organizationName="Your workspace"
                items={[
                    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
                    { label: "Organization", href: "/organization", icon: Building2 },
                ]}
            />
            <SidebarInset>
                <header className="flex h-16 items-center gap-3 border-b border-border/70 px-5 md:px-8">
                    <SidebarTrigger />
                    <div className="h-5 w-px bg-border" />
                    <span className="text-sm text-muted-foreground">Job postings</span>
                </header>

                <main className="flex-1 bg-muted/30 px-5 py-8 md:px-8 md:py-12">
                    <div className="mx-auto max-w-5xl">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Hiring workspace</p>
                                <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">Job postings</h1>
                                <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                                    Keep your open roles organized and easy for your hiring team to find.
                                </p>
                            </div>
                            <Button render={<Link to="/job-posting/create" />} nativeButton={false}>
                                <Plus aria-hidden="true" />
                                Create job posting
                            </Button>
                        </div>

                        {jobPostings.length > 0 ? (
                            <div className="mt-8 grid gap-4 md:grid-cols-2">
                                {jobPostings.map((job) => (
                                    <article key={job.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
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
                                                {job.applyBy ? `Apply by ${job.applyBy}` : "No closing date"}
                                            </span>
                                        </div>
                                        <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
                                            {job.skillCount} {job.skillCount === 1 ? "skill" : "skills"} selected
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <section className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <BriefcaseBusiness aria-hidden="true" className="size-6" />
                                </div>
                                <h2 className="mt-5 text-lg font-semibold">No job postings yet</h2>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                    Create your first job posting to start organizing a role, its timeline, and the skills your team needs.
                                </p>
                                <Button className="mt-6" render={<Link to="/job-posting/create" />} nativeButton={false}>
                                    <Plus aria-hidden="true" />
                                    Create your first posting
                                </Button>
                            </section>
                        )}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
