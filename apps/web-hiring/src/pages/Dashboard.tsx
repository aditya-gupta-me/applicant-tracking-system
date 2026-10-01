import { useSession } from "@repo/auth";
import { Link } from "react-router-dom";
import { Building2, ChevronRight, LayoutDashboard, UserPlus } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAdminStore } from "@/store/useAdminStore";

export default function Dashboard() {
    const { data: session } = useSession();
    const user = session?.user;
    const { admin } = useAdminStore();

    if (!user) {
        return null;
    }

    const firstName = user.name.trim().split(" ")[0] || "there";

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
                    <span className="text-sm text-muted-foreground">Workspace overview</span>
                </header>

                <main className="flex-1 bg-muted/30 px-5 py-8 md:px-8 md:py-12">
                    <div className="mx-auto max-w-5xl">
                        <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-8 text-primary-foreground shadow-sm md:px-10 md:py-10">
                            <div className="relative z-10 max-w-2xl">
                                <p className="mb-3 text-sm font-medium text-primary-foreground/70">Tuesday, September 29, 2026</p>
                                <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-5xl">Good morning, {firstName}.</h1>
                                <p className="mt-4 max-w-lg text-sm leading-6 text-primary-foreground/75 md:text-base">
                                    {admin
                                        ? "Keep your hiring workspace moving. Bring your team in and keep organization details close at hand."
                                        : "Keep your hiring workspace moving and keep your organization details close at hand."}
                                </p>
                            </div>
                            <div className="absolute -right-12 -top-20 size-64 rounded-full border-28 border-primary-foreground/10" />
                            <div className="absolute -bottom-28 right-24 size-48 rounded-full border-20 border-primary-foreground/10" />
                        </section>

                        <section className="mt-8">
                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Quick actions</p>
                                <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">What would you like to do?</h2>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {admin && (
                                    <Link
                                        to="/invite-members"
                                        className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <UserPlus className="size-5" />
                                            </div>
                                            <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                        </div>
                                        <h3 className="mt-8 text-lg font-semibold">Invite a team member</h3>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">Add a colleague to your organization and get everyone hiring together.</p>
                                    </Link>
                                )}

                                <Link
                                    to="/organization"
                                    className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                            <Building2 className="size-5" />
                                        </div>
                                        <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                    </div>
                                    <h3 className="mt-8 text-lg font-semibold">View your organization</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Check the workspace you belong to and review its organization options.</p>
                                </Link>
                            </div>
                        </section>

                        <section id="organization" className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-medium">{admin ? "Your organization" : "Your workspace"}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {admin
                                        ? "You are connected to Your workspace. Invite your team to start collaborating on candidates and roles."
                                        : "You are connected to Your workspace. Review your organization details and continue working with your team."}
                                </p>
                            </div>
                            {admin && (
                                <Button render={<Link to="/invite-members" />} nativeButton={false} size="lg">
                                    <UserPlus />
                                    Invite members
                                </Button>
                            )}
                        </section>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}