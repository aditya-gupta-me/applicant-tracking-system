import { useEffect, useState } from "react";
import { useSession } from "@repo/auth";
import { BriefcaseBusiness, Building2, LayoutDashboard, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@repo/ui/components/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { api } from "@/api/api";
import { JobPostingCard } from "@repo/ui/components/job-posting-card";
import type { JobPosting } from "./job-posting-types";

export default function JobPosting() {
    const { data: session } = useSession();
    const user = session?.user;
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadJobPostings() {
            try {
                const response = await api.get<{ jobs: JobPosting[] }>("api/job-posting/get");
                if (isMounted) {
                    setJobPostings(response.data.jobs);
                }
            } catch (requestError) {
                console.error("Unable to load job postings:", requestError);
                if (isMounted) {
                    setError("We couldn't load job postings. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadJobPostings();

        return () => {
            isMounted = false;
        };
    }, []);

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

                        {isLoading ? (
                            <section className="mt-8 rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-sm">
                                <p className="text-sm text-muted-foreground">Loading job postings...</p>
                            </section>
                        ) : error ? (
                            <section className="mt-8 rounded-2xl border border-destructive/30 bg-card px-6 py-14 text-center shadow-sm">
                                <p className="text-sm text-destructive" role="alert">{error}</p>
                            </section>
                        ) : jobPostings.length > 0 ? (
                            <div className="mt-8 grid gap-4 md:grid-cols-2">
                                {jobPostings.map((job) => (
                                    <Link key={job.id} to={`/job-posting/${job.id}`} className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                                        <JobPostingCard
                                            job={{
                                                ...job,
                                                departmentName: job.department.name,
                                                skills: job.jobSkills.map((jobSkill) => ({
                                                    id: jobSkill.skill.id,
                                                    name: jobSkill.skill.name,
                                                    isRequired: jobSkill.isRequired,
                                                })),
                                            }}
                                        />
                                    </Link>
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
