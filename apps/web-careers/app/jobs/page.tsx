import { JobPostingCard } from "@repo/ui/components/job-posting-card";
import type { JobTypeValue } from "@repo/schema";
import axios from 'axios';
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

type PublicJob = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  type: JobTypeValue;
  applyBy: string | null;
  department: {
    name: string;
  };
  jobSkills: Array<{
    isRequired: boolean;
    skill: {
      id: string;
      name: string;
    };
  }>;
};

async function getJobs(): Promise<{ jobs: PublicJob[] }> {
  await connection();
  const response = await axios.get<{ jobs: PublicJob[] }>('http://localhost:3000/api/public/jobs');

  return response.data;
}

function JobsPageFallback() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Open positions</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-80 animate-pulse rounded-2xl border border-border bg-muted"
          />
        ))}
      </div>
    </section>
  );
}

async function JobsPageContent() {
  const { jobs } = await getJobs();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Open positions</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <JobPostingCard
              job={{
                id: job.id,
                title: job.title,
                description: job.description,
                location: job.location,
                type: job.type,
                applyBy: job.applyBy,
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
    </section>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageFallback />}>
      <JobsPageContent />
    </Suspense>
  );
}