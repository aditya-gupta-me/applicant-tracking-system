import { useState } from "react";
import axios from "axios";
import { useSession } from "@repo/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateDepartmentInput, createDepartmentSchema } from "@repo/schema";
import { ArrowLeft, Building2, CheckCircle2, LayoutDashboard, Plus, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { api } from "@/api/api";
import { AppSidebar } from "@/components/app-sidebar";
import { useAdminStore } from "@/store/useAdminStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";

type ApiErrorResponse = {
    error?: string | { message?: string };
    message?: string;
};

export default function CreateDepartment() {
    const { data: session } = useSession();
    const user = session?.user;
    const { admin } = useAdminStore();
    const { getDepartments } = useDepartmentStore();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateDepartmentInput>({
        resolver: zodResolver(createDepartmentSchema),
        mode: "onChange",
    });

    async function onSubmit(data: CreateDepartmentInput) {
        setSubmitError("");
        setSuccessMessage("");

        try {
            await api.post("api/department/create", { name: data.name });
            await getDepartments();
            reset();
            setSuccessMessage(`${data.name.trim()} is ready for your job postings.`);
        } catch (error: unknown) {
            if (axios.isAxiosError<ApiErrorResponse>(error)) {
                const responseError = error.response?.data.error;
                const message = typeof responseError === "string"
                    ? responseError
                    : responseError?.message ?? error.response?.data.message;
                setSubmitError(message ?? "We couldn't create that department. Please try again.");
            } else {
                setSubmitError("We couldn't create that department. Please try again.");
            }
        }
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
                    <span className="text-sm text-muted-foreground">Organization settings</span>
                </header>

                <main className="flex-1 bg-muted/30 px-5 py-8 md:px-8 md:py-12">
                    <div className="mx-auto max-w-5xl">
                        <Link
                            to="/organization"
                            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Back to organization
                        </Link>

                        <div className="mt-6 max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workspace structure</p>
                            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">Add a department</h1>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                                Create a department to keep roles organized and help your team choose the right hiring group.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.7fr)]">
                            <form
                                className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
                                onSubmit={handleSubmit(onSubmit)}
                                noValidate
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Plus aria-hidden="true" className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Department details</h2>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            Use a clear name that will make sense to everyone creating job postings.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-2">
                                    <label htmlFor="department-name" className="text-sm font-medium">
                                        Department name
                                    </label>
                                    <Input
                                        id="department-name"
                                        type="text"
                                        placeholder="e.g. Engineering"
                                        autoComplete="organization-title"
                                        aria-invalid={Boolean(errors.name)}
                                        aria-describedby={errors.name ? "department-name-error" : "department-name-help"}
                                        {...register("name")}
                                    />
                                    {errors.name ? (
                                        <p id="department-name-error" className="text-sm text-destructive" role="alert">
                                            {errors.name.message}
                                        </p>
                                    ) : (
                                        <p id="department-name-help" className="text-sm text-muted-foreground">
                                            Department names are unique within your organization.
                                        </p>
                                    )}
                                </div>

                                {submitError && (
                                    <p className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                                        {submitError}
                                    </p>
                                )}
                                {successMessage && (
                                    <p className="mt-6 flex items-start gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400" role="status">
                                        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                                        <span>{successMessage}</span>
                                    </p>
                                )}

                                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Button type="button" variant="outline" onClick={() => navigate("/organization")}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Creating department..." : "Create department"}
                                    </Button>
                                </div>
                            </form>

                            <aside className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground shadow-sm md:p-8">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/15">
                                    <Building2 aria-hidden="true" className="size-5" />
                                </div>
                                <h2 className="mt-6 text-lg font-semibold">Build a clearer workspace</h2>
                                <p className="mt-2 text-sm leading-6 text-primary-foreground/75">
                                    Departments make it easier to route candidates and keep your hiring pipeline focused.
                                </p>
                                <ul className="mt-6 grid gap-4 text-sm">
                                    {["Appears when creating a job posting", "Shared across your organization", "Can be added as your team grows"].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary-foreground/70" />
                                            <span className="text-primary-foreground/85">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </aside>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
