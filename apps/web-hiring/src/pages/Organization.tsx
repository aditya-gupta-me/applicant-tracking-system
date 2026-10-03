import { useSession } from "@repo/auth";
import { Building2, CalendarDays, Globe, LayoutDashboard, Mail, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { Button } from "@repo/ui/components/button";
import { useOrganizationStore, type OrganizationDetails } from "@/store/useOrganizationStore";


export default function Organization() {
    const { data: session } = useSession();
    const user = session?.user;
    const { admin } = useAdminStore();
    const { details, setOrganizationDetails } = useOrganizationStore();

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
                                    {admin && 
                                    <Button render={<Link to="/organization/update" />} nativeButton={false}>
                                        Update details
                                    </Button>}
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}