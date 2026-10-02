import { useSession } from "@repo/auth";
import { Building2, LayoutDashboard, UserPlus } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { InviteUser } from "@/components/invite-user";
import { useAdminStore } from "@/store/useAdminStore";


export default function InviteMember() {
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
                    <span className="text-sm text-muted-foreground">Team access</span>
                </header>
                <main className="flex-1 bg-muted/30 px-5 py-8 md:px-8 md:py-10">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-8 max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workspace settings</p>
                            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">Invite your hiring team</h1>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                                Bring the people who help you find great candidates into your organization.
                            </p>
                        </div>
                        <InviteUser />
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}