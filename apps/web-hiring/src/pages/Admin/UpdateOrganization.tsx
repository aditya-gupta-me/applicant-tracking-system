import { useSession } from "@repo/auth";
import { ArrowLeft, Building2, LayoutDashboard, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { useAdminStore } from "@/store/useAdminStore";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { useForm } from "react-hook-form";
import { updateOrganizationSchema, type UpdateOrganizationInput } from "@repo/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/api/api";
import { Spinner } from "@repo/ui/components/spinner";
import { useOrganizationStore } from "@/store/useOrganizationStore";
import { useEffect } from "react";
import { z } from "zod";

export default function UpdateOrganization() {
    const { data: session } = useSession();
    const user = session?.user;
    const { admin } = useAdminStore();
    const { details, fetchOrganizationDetails, setOrganizationDetails } = useOrganizationStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<z.input<typeof updateOrganizationSchema>, unknown, UpdateOrganizationInput>({
        resolver: zodResolver(updateOrganizationSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (!details) {
            void fetchOrganizationDetails();
        }
    }, [details, fetchOrganizationDetails]);

    useEffect(() => {
        if (!details) {
            return;
        }

        const foundedOn = details.foundedOn ? new Date(details.foundedOn) : null;
        reset({
            name: details.name,
            email: details.email ?? "",
            image: details.image ?? undefined,
            website: details.website ?? "",
            establishedDate: foundedOn && !Number.isNaN(foundedOn.getTime())
                ? foundedOn.toISOString().slice(0, 10)
                : undefined,
        }, {
            keepDirtyValues: true,
        });
    }, [details, reset]);

    async function onSubmit(data: UpdateOrganizationInput) {
        try {
            await api.post("api/organization/update", {
                name: data.name,
                email: data.email,
                website: data.website,
                image: data.image,
                establishedDate: data.establishedDate,
            });
        } catch(error) {
            console.error("ERROR: ", error);
            return;
        }

        setOrganizationDetails({
            name: data.name,
            email: data.email,
            image: data.image ?? null,
            website: data.website,
            foundedOn: data.establishedDate.toISOString(),
        });

        reset({
            ...data,
            establishedDate: data.establishedDate.toISOString().slice(0, 10),
        });

        navigate('/organization');

    }

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
                    <span className="text-sm text-muted-foreground">Update organization</span>
                </header>
                <main className="flex-1 bg-muted/30 px-5 py-8 md:px-8 md:py-12">
                    <div className="mx-auto max-w-3xl">
                        <Link
                            to="/organization"
                            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Back to organization
                        </Link>

                        <div className="mt-6 max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workspace details</p>
                            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">Update your organization</h1>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                                Keep your organization&apos;s public information up to date.
                            </p>
                        </div>

                        <form
                            className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="organization-name">Organization name</Label>
                                    <Input
                                        id="organization-name"
                                        type="text"
                                        placeholder="Google LLC"
                                        autoComplete="organization"
                                        {...register("name")}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="organization-email">Email</Label>
                                    <Input id="organization-email" type="email" placeholder="support@example.com" autoComplete="email" 
                                    {...register("email", {
                                        required: "Organization email is required"
                                    })}
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="organization-image">Image URL</Label>
                                    <Input id="organization-image" type="url" placeholder="https://example.com/logo.png" inputMode="url"
                                    {...register("image")}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="organization-website">Website</Label>
                                    <Input id="organization-website" type="url" placeholder="https://example.com" autoComplete="url" inputMode="url"
                                    {...register("website", {
                                        required: "Website cannot be empty"
                                    })}
                                     />
                                    {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
                                </div>
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="organization-founded-on">Founded on</Label>
                                    <Input id="organization-founded-on" type="date" {...register("establishedDate")} />
                                    {errors.establishedDate && <p className="text-sm text-destructive">{errors.establishedDate.message}</p>}
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button render={<Link to="/organization" />} nativeButton={false} variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Spinner className="size-4"/>}
                                    {isSubmitting ? "Updating details..." : "Save changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
