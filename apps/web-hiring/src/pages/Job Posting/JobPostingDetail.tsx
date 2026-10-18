import { useEffect, useState } from "react";
import { useSession } from "@repo/auth";
import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, LayoutDashboard, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import { api } from "@/api/api";
import { Button } from "@repo/ui/components/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import type { JobPosting } from "./job-posting-types";

const jobTypeLabels: Record<JobPosting["type"], string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    TEMPORARY: "Temporary",
};

function formatDate(value: string | null) {
    if (!value) return "Not specified";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Not specified" : date.toLocaleDateString();
}

export default function JobPostingDetail() {
    const { data: session } = useSession();
    const user = session?.user;
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<JobPosting | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) {
            setError("This job posting could not be found.");
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        api.get<{ job: JobPosting }>(`api/job-posting/get/${jobId}`)
            .then((response) => {
                if (isMounted) setJob(response.data.job);
            })
            .catch((requestError) => {
                console.error("Unable to load job posting:", requestError);
                if (isMounted) setError("We couldn't load this job posting.");
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [jobId]);

    if (!user) return null;

    return (
        <SidebarProvider>
            <AppSidebar user={{ name: user.name, email: user.email }} organizationName="Your workspace" items={[
                { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
                { label: "Organization", href: "/organization", icon: Building2 },
            ]} />
            <SidebarInset>
                <header className="flex h-16 items-center gap-3 border-b border-border/70 px-5 md:px-8">
                    <SidebarTrigger /><div className="h-5 w-px bg-border" /><span className="text-sm text-muted-foreground">Job posting details</span>
                </header>
                <main className="flex-1 bg-muted/30 px-5 py-8 md:px-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Button variant="ghost" render={<Link to="/job-posting" />} nativeButton={false}><ArrowLeft /> Back to job postings</Button>
                        {isLoading ? <p className="mt-8 text-sm text-muted-foreground">Loading job posting...</p> : error ? (
                            <p className="mt-8 text-sm text-destructive" role="alert">{error}</p>
                        ) : job ? (
                            <article className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><BriefcaseBusiness /></div>
                                <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight">{job.title}</h1>
                                <p className="mt-2 text-muted-foreground">{job.department.name}</p>
                                <div className="mt-6 grid gap-4 border-y border-border py-5 text-sm text-muted-foreground sm:grid-cols-3">
                                    <span><BriefcaseBusiness className="mr-2 inline size-4" />{jobTypeLabels[job.type]}</span>
                                    <span><MapPin className="mr-2 inline size-4" />{job.location ?? "Location not specified"}</span>
                                    <span><CalendarDays className="mr-2 inline size-4" />Apply by {formatDate(job.applyBy)}</span>
                                </div>
                                <h2 className="mt-8 text-lg font-semibold">Job description</h2>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{job.description}</p>
                                <h2 className="mt-8 text-lg font-semibold">Required skills</h2>
                                <div className="mt-4 grid gap-3">
                                    {job.jobSkills.length ? job.jobSkills.map((jobSkill) => (
                                        <div key={jobSkill.skill.id} className="rounded-xl border border-border p-4">
                                            <div className="flex justify-between gap-4"><span className="font-medium">{jobSkill.skill.name}</span>{jobSkill.isRequired && <span className="text-sm text-primary">Required</span>}</div>
                                            <p className="mt-2 text-sm text-muted-foreground">Importance: {jobSkill.importance}/5 · Minimum experience: {jobSkill.minimumYearsExperience} {jobSkill.minimumYearsExperience === 1 ? "year" : "years"}</p>
                                        </div>
                                    )) : <p className="text-sm text-muted-foreground">No skills selected.</p>}
                                </div>
                            </article>
                        ) : null}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
