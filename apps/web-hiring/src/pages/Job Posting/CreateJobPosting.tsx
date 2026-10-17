import { useEffect, useState } from "react";
import { useSession } from "@repo/auth";
import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, LayoutDashboard, Plus, Tags, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { useForm } from "react-hook-form";
import { type CreateJobPostingInput, createJobPostingSchema } from "@repo/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { api } from "@/api/api";

type JobType = "FULL_TIME" | "INTERNSHIP" | "CONTRACT" | "PART_TIME" | "TEMPORARY";

type Skill = {
    id: string;
    name: string;
    isActive: boolean;
    category: {
        id: string;
        categoryName: string;
    }
}

type SkillOption = {
    id: string;
    name: string;
    categoryName: string;
};

type SelectedSkill = SkillOption & {
    isRequired: boolean;
    importance: number;
    minimumYearsExperience: number;
};

const jobTypes: Array<{ value: JobType; label: string }> = [
    { value: "FULL_TIME", label: "Full-time" },
    { value: "PART_TIME", label: "Part-time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "TEMPORARY", label: "Temporary" },
];

export default function CreateJobPosting() {
    const { data: session } = useSession();
    const user = session?.user;
    const { departments, getDepartments, isLoading: isLoadingDepartments, error: departmentsError } = useDepartmentStore();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedSkillId, setSelectedSkillId] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
    // const [skillToAdd, setSkillToAdd] = useState<Skill[]>([]);


    console.log(selectedSkills);

    const availableSkills: SkillOption[] = skills.filter((skill) => skill.isActive)
    .map((skill) => ({
        id: skill.id,
        name: skill.name,
        categoryName: skill.category.categoryName
    }));


    async function loadSkill() {
        const response = await api.get<{ skills: Skill[] }>('api/skill/get-skills');

        setSkills(response.data.skills);
        // console.log(response.data.skills);
    }

    useEffect(() => {
        void getDepartments();
        loadSkill();
    }, [getDepartments]);

    if (!user) {
        return null;
    }

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<z.input<typeof createJobPostingSchema>, unknown, CreateJobPostingInput>({
        resolver: zodResolver(createJobPostingSchema),
        mode: "onChange",
        defaultValues: {
            selectedSkill: [],
        },
    })

    useEffect(() => {
        register("selectedSkill");
        setValue("selectedSkill", selectedSkills, { shouldValidate: true });
    }, [register, selectedSkills, setValue]);

    function addSkill() {
        const skill = availableSkills.find((option) => option.id === selectedSkillId);
        if (!skill || selectedSkills.some((selected) => selected.id === skill.id)) {
            return;
        }

        setSelectedSkills((currentSkills) => [
            ...currentSkills,
            {
                ...skill,
                isRequired: true,
                importance: 3,
                minimumYearsExperience: 0,
            },
        ]);
        setSelectedSkillId("");
    }

    function removeSkill(skillId: string) {
        setSelectedSkills((currentSkills) => currentSkills.filter((skill) => skill.id !== skillId));
    }

    function updateSkill(skillId: string, updates: Partial<SelectedSkill>) {
        setSelectedSkills((currentSkills) =>
            currentSkills.map((skill) => skill.id === skillId ? { ...skill, ...updates } : skill),
        );
    }

    async function onSubmit(data: CreateJobPostingInput) {
        // LOG
        console.log(data);

        try {
            const response = await api.post('api/job-posting/create', {
                title: data.title,
                description: data.description,
                applyBy: data.applyBy,
                location: data.location,
                startDate: data.startDate,
                type: data.type,
                departmentId: data.departmentId,
                selectedSkill: data.selectedSkill
            })

            alert('Job Posting created!');
            setSelectedSkills([]);
            setSelectedSkillId("");
            reset({ selectedSkill: [] });
            // LOG
            console.log(response);
        } catch (error) {
            console.error("ERROR: ", error);
            return;
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar
                user={{ name: user.name, email: user.email }}
                organizationName="Your workspace"
                items={[
                    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
                    { label: "Organization", href: "/organization", icon: Building2 },
                ]}
            />
            <SidebarInset>
                <header className="flex h-16 items-center gap-3 border-b border-border/70 px-5 md:px-8">
                    <SidebarTrigger />
                    <div className="h-5 w-px bg-border" />
                    <span className="text-sm text-muted-foreground">Job postings</span>
                </header>

                <main className="flex-1 bg-muted/30 px-5 py-8 md:px-8 md:py-12">
                    <div className="mx-auto max-w-5xl">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Back to overview
                        </Link>

                        <div className="mt-6 max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Hiring workspace</p>
                            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">Create a job posting</h1>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                                Define the role, hiring timeline, and skills your team will use to evaluate candidates.
                            </p>
                        </div>

                        <form className="mt-8 grid gap-6" onSubmit={handleSubmit(onSubmit, 
                            (validationErrors) => console.error('Error', validationErrors))}>
                            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <BriefcaseBusiness aria-hidden="true" className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Role details</h2>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">Start with the information candidates will see first.</p>
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-5 md:grid-cols-2">
                                    <div className="grid gap-2 md:col-span-2">
                                        <label htmlFor="job-title" className="text-sm font-medium">Job title</label>
                                        <Input id="job-title" placeholder="e.g. Senior Frontend Engineer" 
                                        {...register("title")}
                                        />
                                        {errors && <p style={{color: "red"}}>{errors.title?.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="job-type" className="text-sm font-medium">Employment type</label>
                                        <select id="job-type" defaultValue="" className="h-9 w-full rounded-3xl border border-input bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                                        {...register("type")}
                                        >
                                            <option value="" disabled>Select employment type</option>
                                            {jobTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="job-department" className="text-sm font-medium">Department</label>
                                        <select id="job-department" defaultValue="" required disabled={isLoadingDepartments || departments.length === 0} className="h-9 w-full rounded-3xl border border-input bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
                                        {...register("departmentId")}
                                        >
                                            <option value="" disabled>
                                                {isLoadingDepartments ? "Loading departments..." : departments.length ? "Select department" : "No departments available"}
                                            </option>
                                            {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                                        </select>
                                        {departmentsError ? (
                                            <p className="text-sm text-destructive" role="alert">{departmentsError}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                Departments are shared across your organization.
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <label htmlFor="job-location" className="text-sm font-medium">Location</label>
                                        <Input id="job-location" placeholder="e.g. Bengaluru, India or Remote" 
                                        {...register("location")}
                                        />
                                        {errors && <p style={{color: "red"}}>{errors.location?.message}</p>}
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <label htmlFor="job-description" className="text-sm font-medium">Job description</label>
                                        <Textarea id="job-description" rows={7} placeholder="Describe the role, responsibilities, and what success looks like." 
                                        {...register("description")}
                                        />
                                        {errors && <p style={{color: "red"}}>{errors.description?.message}</p>}
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                        <CalendarDays aria-hidden="true" className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Hiring timeline</h2>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">Set dates to keep the hiring team aligned.</p>
                                    </div>
                                </div>
                                <div className="mt-8 grid gap-5 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <label htmlFor="job-start-date" className="text-sm font-medium">Expected start date</label>
                                        <Input id="job-start-date" type="date" 
                                        {...register("startDate")}
                                        />
                                        {errors && <p style={{color: "red"}}>{errors.startDate?.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="job-apply-by" className="text-sm font-medium">Applications close on</label>
                                        <Input id="job-apply-by" type="date" 
                                        {...register("applyBy")}
                                        />
                                        {errors && <p style={{color: "red"}}>{errors.applyBy?.message}</p>}
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Tags aria-hidden="true" className="size-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold">Required skills</h2>
                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">Add skills and define how important each one is for this role.</p>
                                        </div>
                                    </div>
                                    <Link to="/skills/manage" className="hidden text-sm font-medium text-primary hover:underline sm:block">Manage skill library</Link>
                                </div>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
                                    <div className="grid flex-1 gap-2">
                                        <label htmlFor="skill-to-add" className="text-sm font-medium">Add a skill</label>
                                        <select id="skill-to-add" value={selectedSkillId} onChange={(event) => setSelectedSkillId(event.target.value)} disabled={availableSkills.length === 0} className="h-9 w-full rounded-3xl border border-input bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60">
                                            <option value="">{availableSkills.length ? "Select a skill" : "Skills will load here"}</option>
                                            {availableSkills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name} · {skill.categoryName}</option>)}
                                        </select>
                                    </div>
                                    <Button type="button" variant="outline" onClick={addSkill} disabled={!skills}>
                                        <Plus aria-hidden="true" />
                                        Add skill
                                    </Button>
                                </div>

                                {selectedSkills.length > 0 ? (
                                    <div className="mt-6 grid gap-3">
                                        {selectedSkills.map((skill) => (
                                            <div key={skill.id} className="rounded-2xl border border-border/80 bg-muted/20 p-4">
                                                <div className="flex flex-wrap items-start justify-between gap-4">
                                                    <div>
                                                        <p className="font-medium">{skill.name}</p>
                                                        <p className="mt-1 text-xs text-muted-foreground">{skill.categoryName}</p>
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ${skill.name}`} onClick={() => removeSkill(skill.id)}>
                                                        <Trash2 aria-hidden="true" />
                                                    </Button>
                                                </div>
                                                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input type="checkbox" checked={skill.isRequired} onChange={(event) => updateSkill(skill.id, { isRequired: event.target.checked })} className="size-4 accent-primary" />
                                                        Required skill
                                                    </label>
                                                    <label className="grid gap-1 text-sm">
                                                        Importance (1–5)
                                                        <Input type="number" min={1} max={5} value={skill.importance} onChange={(event) => updateSkill(skill.id, { importance: Number(event.target.value) })} />
                                                    </label>
                                                    <label className="grid gap-1 text-sm">
                                                        Minimum years
                                                        <Input type="number" min={0} step={1} value={skill.minimumYearsExperience} onChange={(event) => updateSkill(skill.id, { minimumYearsExperience: Number(event.target.value) })} />
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-6 rounded-2xl border border-dashed border-border px-5 py-8 text-center">
                                        <Tags className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
                                        <p className="mt-3 text-sm font-medium">No skills added yet</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Select skills above after your skill library is loaded.</p>
                                    </div>
                                )}
                            </section>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button type="button" variant="outline" render={<Link to="/dashboard" />} nativeButton={false}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting} className={'cursor-pointer'}><CheckCircle2 aria-hidden="true"/>
                                {isSubmitting ? "Creating Job Posting..." : "Create Job Posting"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
