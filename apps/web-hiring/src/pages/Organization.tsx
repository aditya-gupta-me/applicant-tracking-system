import { useSession } from "@repo/auth";
import { Building2, LayoutDashboard, UserPlus } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAdminStore } from "@/store/useAdminStore";

export default function Organization() {
    const { data: session } = useSession();
    const user = session?.user;
    const { admin } = useAdminStore();

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
                            <div className="flex items-start gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Building2 className="size-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Current workspace</p>
                                    <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Your workspace</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        You are signed in as {user.email}.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}