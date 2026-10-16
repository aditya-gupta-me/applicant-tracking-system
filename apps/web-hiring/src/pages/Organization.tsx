import { useSession } from "@repo/auth";
import { Building2, CalendarDays, ChevronRight, Globe, LayoutDashboard, Mail, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { Button } from "@repo/ui/components/button";
import { useOrganizationStore, type OrganizationDetails } from "@/store/useOrganizationStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";


export default function Organization() {
    const { data: session } = useSession();
    const user = session?.user;
    const { admin } = useAdminStore();
    const { details, setOrganizationDetails } = useOrganizationStore();
    const { departments, getDepartments, isLoading: isLoadingDepartments, error: departmentsError } = useDepartmentStore();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function getOrganizationDetails() {
            try {
                const res = await api.get("api/organization/details");
                if (isMounted) {
                    const organization: OrganizationDetails = {
                        name: res.data.org?.name ?? "",
                        image: res.data.org?.image ?? null,
                        email: res.data.org?.email ?? null,
                        website: res.data.org?.website ?? null,
                        foundedOn: res.data.org?.foundedOn ?? null,
                    };
                    setOrganizationDetails(organization);
                }
            } catch {
                if (isMounted) {
                    setError("We couldn't load your organization details. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void getOrganizationDetails();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        void getDepartments();
    }, [getDepartments]);

    if (!user) {
        return null;
    }

    const organization = details ?? {
        name: "",
        image: null,
        email: null,
        website: null,
        foundedOn: null,
    };
    const parsedFoundedDate = organization.foundedOn ? new Date(organization.foundedOn) : null;
    const foundedDate = parsedFoundedDate && !Number.isNaN(parsedFoundedDate.getTime())
        ? parsedFoundedDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Not provided";
    const organizationInitial = organization.name.trim().charAt(0).toUpperCase() || "O";

    return (
        <SidebarProvider>
            <AppSidebar
                user={{ name: user.name, email: user.email }}
                organizationName="Your workspace"
                items={[
                    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
                    ...(admin ? [{ label: "Invite team members", href: "/invite-members", icon: UserPlus }] : []),
                    { label: "Organization", href: "/organization", icon: Building2 },
                ]}
            />
            <SidebarInset>
                <header className="flex h-16 items-center gap-3 border-b border-border/70 px-5 md:px-8">
                    <SidebarTrigger />
                    <div className="h-5 w-px bg-border" />
                    <span className="text-sm text-muted-foreground">Organization</span>
                </header>
                <main className="flex-1 bg-muted/30 px-5 py-8 md:px-8 md:py-12">
                    <div className="mx-auto max-w-5xl">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workspace details</p>
                            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">Your organization</h1>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                                View the organization you belong to and keep your workspace information close at hand.
                            </p>
                        </div>

                        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                            {isLoading ? (
                                <p className="text-sm text-muted-foreground">Loading organization details...</p>
                            ) : error ? (
                                <p className="text-sm text-destructive">{error}</p>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                        {organization.image ? (
                                            <img
                                                src={organization.image}
                                                alt={`${organization.name} logo`}
                                                className="size-20 rounded-2xl border border-border object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-semibold text-primary">
                                                {organizationInitial}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Current workspace</p>
                                            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
                                                {organization.name || "Unnamed organization"}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
                                        <div className="flex items-start gap-3">
                                            <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Email</p>
                                                <p className="mt-1 break-all text-sm">{organization.email || "Not provided"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Globe className="mt-0.5 size-5 shrink-0 text-primary" />
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Website</p>
                                                {organization.website ? (
                                                    <a
                                                        href={organization.website}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-1 block break-all text-sm text-primary underline-offset-4 hover:underline"
                                                    >
                                                        {organization.website}
                                                    </a>
                                                ) : (
                                                    <p className="mt-1 text-sm">Not provided</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CalendarDays className="mt-0.5 size-5 shrink-0 text-primary" />
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Founded on</p>
                                                <p className="mt-1 text-sm">{foundedDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end border-t border-border pt-6">
                                    {admin && (
                                        <Button render={<Link to="/organization/update" />} nativeButton={false}>
                                            Update details
                                        </Button>
                                    )}
                                    </div>
                                </>
                            )}
                        </section>

                        {admin && (
                            <section className="group mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-primary/40">
                                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <Building2 aria-hidden="true" className="size-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Hiring structure</p>
                                            <h2 className="mt-2 text-xl font-semibold tracking-tight">Organize your departments</h2>
                                            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                                                Create departments like Engineering, Marketing, or Finance so job postings stay easy to organize.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        render={<Link to="/organization/department/create" />}
                                        nativeButton={false}
                                        size="lg"
                                        className="w-full sm:w-auto"
                                    >
                                        <Plus aria-hidden="true" />
                                        Add a department
                                        <ChevronRight aria-hidden="true" />
                                    </Button>
                                </div>
                            </section>
                        )}

                        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Hiring structure</p>
                                    <h2 className="mt-2 text-xl font-semibold tracking-tight">Departments</h2>
                                </div>
                                <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                                    {departments.length}
                                </span>
                            </div>
                            {departmentsError ? (
                                <p className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                                    {departmentsError}
                                </p>
                            ) : isLoadingDepartments ? (
                                <p className="mt-6 text-sm text-muted-foreground">Loading departments...</p>
                            ) : departments.length > 0 ? (
                                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {departments.map((department) => (
                                        <div key={department.id} className="rounded-xl border border-border/80 bg-muted/20 px-4 py-3">
                                            <p className="font-medium">{department.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-6 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                                    No departments have been created yet.
                                </p>
                            )}
                        </section>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}