'use client';

import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Upload } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { applyForJobSchema, type ApplyForJobInput } from "@repo/schema";
import { Button } from "@repo/ui/components/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { Spinner } from "@repo/ui/components/spinner";

type JobSummary = {
    title: string;
    department: { name: string };
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_WEBHOOK_URL ?? "http://localhost:3000";

export function JobApplyForm() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [job, setJob] = useState<JobSummary | null>(null);
    const [jobLoadError, setJobLoadError] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ApplyForJobInput>({
        resolver: zodResolver(applyForJobSchema),
        defaultValues: { jobId: id, currentCity: "" },
        mode: "onChange",
    });

    useEffect(() => {
        let cancelled = false;

        async function loadJob() {
            try {
                const response = await fetch(`${apiBaseUrl}/api/public/jobs/${encodeURIComponent(id)}`);
                if (!response.ok) throw new Error("Unable to load job");

                const data: { job: JobSummary | null } = await response.json();
                if (!cancelled) {
                    setJob(data.job);
                    setJobLoadError(!data.job);
                }
            } catch {
                if (!cancelled) setJobLoadError(true);
            }
        }

        void loadJob();
        return () => {
            cancelled = true;
        };
    }, [id]);

    async function onSubmit(data: ApplyForJobInput) {
        setSubmitError(null);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("contactNumber", data.contactNumber);
        formData.append("currentCity", data.currentCity ?? "");
        formData.append("resume", data.resume);
        formData.append("jobId", data.jobId);

        try {
            const response = await fetch(`${apiBaseUrl}/api/job-posting/apply`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const result: { error?: string } = await response.json().catch(() => ({}));
                throw new Error(result.error ?? "We could not submit your application. Please try again.");
            }

            setSubmitted(true);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "We could not submit your application.");
        }
    }

    if (submitted) {
        return (
            <section className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6 py-16">
                <div className="w-full rounded-2xl border border-border bg-background p-8 text-center shadow-sm md:p-12">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 aria-hidden="true" className="size-7" />
                    </div>
                    <h1 className="mt-6 text-3xl font-semibold tracking-tight">Application submitted</h1>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                        Thank you for applying{job ? ` for ${job.title}` : ""}. The hiring team will review your application.
                    </p>
                    <Button className="mt-8" onClick={() => router.push("/jobs")}>
                        View open positions
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <div className="min-h-full bg-muted/30">
            <section className="border-b border-border bg-background">
                <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
                    <Link
                        href={`/job-detail/${id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Back to job details
                    </Link>
                    <div className="mt-9 flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BriefcaseBusiness aria-hidden="true" className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-primary">
                                {job?.department.name ?? (jobLoadError ? "Job application" : "Loading role...")}
                            </p>
                            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                                {job?.title ?? "Apply for this role"}
                            </h1>
                            <p className="mt-3 text-sm text-muted-foreground">
                                Share your details and resume with the hiring team.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:py-14">
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-background p-6 shadow-sm md:p-10">
                    <div>
                        <h2 className="text-xl font-semibold">Your application</h2>
                        <p className="mt-2 text-sm text-muted-foreground">All fields marked with an asterisk are required.</p>
                    </div>

                    <FieldGroup className="mt-8">
                        <Field>
                            <FieldLabel htmlFor="name">Full name *</FieldLabel>
                            <Input id="name" placeholder="Aarav Sharma" aria-invalid={Boolean(errors.name)} {...register("name")} />
                            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Email address *</FieldLabel>
                            <Input id="email" type="email" placeholder="aarav@example.com" aria-invalid={Boolean(errors.email)} {...register("email")} />
                            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                        </Field>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="contactNumber">Mobile number *</FieldLabel>
                                <Input id="contactNumber" type="tel" inputMode="numeric" placeholder="9876543210" aria-invalid={Boolean(errors.contactNumber)} {...register("contactNumber")} />
                                <FieldDescription>Use a 10-digit Indian mobile number.</FieldDescription>
                                {errors.contactNumber && <p className="text-sm text-red-600">{errors.contactNumber.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="currentCity">Current city</FieldLabel>
                                <Input id="currentCity" placeholder="Bengaluru" {...register("currentCity")} />
                                {errors.currentCity && <p className="text-sm text-red-600">{errors.currentCity.message}</p>}
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="resume">Resume *</FieldLabel>
                            <Controller
                                name="resume"
                                control={control}
                                render={({ field: { onChange, onBlur, name, ref } }) => (
                                    <Input
                                        id="resume"
                                        name={name}
                                        ref={ref}
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        aria-invalid={Boolean(errors.resume)}
                                        onBlur={onBlur}
                                        onChange={(event) => onChange(event.target.files?.[0])}
                                    />
                                )}
                            />
                            <FieldDescription className="flex items-center gap-2">
                                <Upload aria-hidden="true" className="size-3.5" /> PDF only, up to 5 MB.
                            </FieldDescription>
                            {errors.resume && <p className="text-sm text-red-600">{errors.resume.message}</p>}
                        </Field>
                        <input type="hidden" {...register("jobId")} />
                        {submitError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
                        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                            {isSubmitting && <Spinner className="size-4" />}
                            {isSubmitting ? "Submitting application..." : "Submit application"}
                        </Button>
                    </FieldGroup>
                </form>

                <aside className="h-fit rounded-2xl border border-border bg-background p-6 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Application checklist</p>
                    <ul className="mt-5 space-y-4 text-sm">
                        <li className="flex gap-3"><CheckCircle2 className="size-4 shrink-0 text-primary" />Your contact details</li>
                        <li className="flex gap-3"><CheckCircle2 className="size-4 shrink-0 text-primary" />A current PDF resume</li>
                        <li className="flex gap-3"><CheckCircle2 className="size-4 shrink-0 text-primary" />A reachable mobile number</li>
                    </ul>
                </aside>
            </main>
        </div>
    );
}
