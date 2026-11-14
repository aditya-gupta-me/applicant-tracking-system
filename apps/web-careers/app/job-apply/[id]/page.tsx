import { Suspense } from "react";

import { JobApplyForm } from "./job-apply-form";

function JobApplyFallback() {
    return (
        <section className="mx-auto min-h-[70vh] max-w-6xl px-6 py-10 md:py-14">
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-9 h-14 w-96 max-w-full animate-pulse rounded bg-muted" />
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="h-136 animate-pulse rounded-2xl border border-border bg-background" />
                <div className="h-52 animate-pulse rounded-2xl border border-border bg-background" />
            </div>
        </section>
    );
}

export default function JobApplyPage() {
    return (
        <Suspense fallback={<JobApplyFallback />}>
            <JobApplyForm />
        </Suspense>
    );
}
