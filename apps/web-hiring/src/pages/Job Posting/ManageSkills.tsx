import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@repo/auth";
import { ArrowLeft, BookOpen, Building2, CheckCircle2, LayoutDashboard, Plus, Tags } from "lucide-react";
import { Link } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { useForm } from "react-hook-form";
import { type CreateSkillCategoryInput, createSkillCategorySchema, type CreateSkillsInput, createSkillsSchema } from "@repo/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod';
import { api } from "@/api/api";

type SkillCategory = {
    id: string;
    categoryName: string;
    description: string | null;
    _count: {
        skills: number;
    };
};

type Skill = {
    id: string;
    name: string;
    isActive: boolean;
    category: {
        id: string;
        categoryName: string;
    };
};

type ApiError = {
    error?: string;
};

export default function ManageSkills() {
    const { data: session } = useSession();
    const user = session?.user;
    const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
    const [categoriesError, setCategoriesError] = useState("");
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [skillsError, setSkillsError] = useState("");
    const [isLoadingSkills, setIsLoadingSkills] = useState(true);
    const [categorySubmitError, setCategorySubmitError] = useState("");
    const [categorySuccess, setCategorySuccess] = useState("");
    const [skillSubmitError, setSkillSubmitError] = useState("");
    const [skillSuccess, setSkillSuccess] = useState("");

    const loadSkillCategories = useCallback(async () => {
        setCategoriesError("");
        setIsLoadingCategories(true);

        try {
            const response = await api.get<{ skillCategories: SkillCategory[] }>("api/skill/get-skills-category");
            setSkillCategories(response.data.skillCategories);
        } catch (error) {
            console.error("Unable to load skill categories:", error);
            setCategoriesError("We couldn't load skill categories. Please try again.");
        } finally {
            setIsLoadingCategories(false);
        }
    }, []);

    const loadSkills = useCallback(async () => {
        setSkillsError("");
        setIsLoadingSkills(true);

        try {
            const response = await api.get<{ skills: Skill[] }>("api/skill/get-skills");
            setSkills(response.data.skills);
        } catch (error) {
            console.error("Unable to load skills:", error);
            setSkillsError("We couldn't load skills. Please try again.");
        } finally {
            setIsLoadingSkills(false);
        }
    }, []);

    useEffect(() => {
        void loadSkillCategories();
        void loadSkills();
    }, [loadSkillCategories, loadSkills]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<z.input<typeof createSkillCategorySchema>, unknown, CreateSkillCategoryInput>({
        resolver: zodResolver(createSkillCategorySchema),
        mode: "onChange",
        defaultValues: {
            createdAt: new Date(),
        },
    })

    const {
        register: registerSkill,
        handleSubmit: handleSkillSubmit,
        reset: resetSkill,
        formState: { 
            errors: skillErrors,
            isSubmitting: isSkillSubmitting
        }
    } = useForm<z.input<typeof createSkillsSchema>, unknown,
    CreateSkillsInput>({
        resolver: zodResolver(createSkillsSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            isActive: true,
            createdAt: new Date(),
            categoryId: "",
        }
    })

    async function handleSkillCategory(data: CreateSkillCategoryInput) {
        setCategorySubmitError("");
        setCategorySuccess("");

        try {
            await api.post('api/skill/create-skills-category', {
                categoryName: data.categoryName,
                description: data.description,
                createdAt: new Date()
            });
            reset({ categoryName: "", description: "", createdAt: new Date() });
            await loadSkillCategories();
            setCategorySuccess("Category added to your skill library.");
        } catch(error) {
            console.error("ERROR: ", error);
            setCategorySubmitError(getApiErrorMessage(error, "We couldn't create that category."));
        }
    }

    async function handleSkill(data: CreateSkillsInput) {
        setSkillSubmitError("");
        setSkillSuccess("");
        try {
            await api.post('api/skill/create-skills', {
                name: data.name,
                isActive: data.isActive,
                createdAt: new Date(),
                categoryId: data.categoryId
            });
            resetSkill({ name: "", isActive: true, createdAt: new Date(), categoryId: "" });
            await Promise.all([loadSkills(), loadSkillCategories()]);
            setSkillSuccess("Skill added to your library.");
        } catch(error) {
            console.error("ERROR: ", error);
            setSkillSubmitError(getApiErrorMessage(error, "We couldn't create that skill."));
        }
    }

    function getApiErrorMessage(error: unknown, fallback: string) {
        if (axios.isAxiosError<ApiError>(error)) {
            return error.response?.data.error ?? fallback;
        }

        return fallback;
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
                    { label: "Organization", href: "/organization", icon: Building2 },
                ]}
            />
            <SidebarInset>
                <header className="flex h-16 items-center gap-3 border-b border-border/70 px-5 md:px-8">
                    <SidebarTrigger />
                    <div className="h-5 w-px bg-border" />
                    <span className="text-sm text-muted-foreground">Skill library</span>
                </header>

                <main className="flex-1 bg-muted/30 px-5 py-8 md:px-8 md:py-12">
                    <div className="mx-auto max-w-5xl">
                        <Link
                            to="/job-posting/create"
                            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Back to job posting
                        </Link>

                        <div className="mt-6 max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Hiring workspace</p>
                            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">Manage skills</h1>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                                Build the reusable skill library your team can use when creating job postings.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
                            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Tags aria-hidden="true" className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Skills</h2>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            Add a skill name and assign it to a category. Saving, editing, and deleting can be connected to the API here.
                                        </p>
                                    </div>
                                </div>

                                <form className="mt-8 grid gap-5" onSubmit={handleSkillSubmit(handleSkill)}>
                                    <div className="grid gap-2">
                                        <label htmlFor="skill-name" className="text-sm font-medium">Skill name</label>
                                        <Input id="skill-name" placeholder="e.g. TypeScript" 
                                        {...registerSkill("name")}
                                        />
                                        {skillErrors.name && (
                                            <p className="text-sm text-destructive" role="alert">{skillErrors.name.message}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="skill-category" className="text-sm font-medium">Category</label>
                                        <select
                                            id="skill-category"
                                            className="h-9 w-full rounded-3xl border border-input bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                                            defaultValue=""
                                            {...registerSkill("categoryId")}
                                        >
                                            <option value="" disabled>Select a category</option>
                                            {skillCategories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.categoryName}
                                                </option>
                                            ))}
                                        </select>
                                        {skillErrors.categoryId && (
                                            <p className="text-sm text-destructive" role="alert">{skillErrors.categoryId.message}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            {isLoadingCategories
                                                ? "Loading categories..."
                                                : "Choose a category for this skill."}
                                        </p>
                                    </div>
                                    <Button type="submit" className="w-fit" disabled={isSkillSubmitting}>
                                        <Plus aria-hidden="true" />
                                        {isSkillSubmitting ? "Adding skill..." : "Add skill"}
                                    </Button>
                                    {skillSubmitError && (
                                        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                                            {skillSubmitError}
                                        </p>
                                    )}
                                    {skillSuccess && (
                                        <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400" role="status">
                                            <CheckCircle2 className="size-4" aria-hidden="true" />
                                            {skillSuccess}
                                        </p>
                                    )}
                                </form>
                            </section>

                            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                        <BookOpen aria-hidden="true" className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Skill categories</h2>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            Group skills so they are easier to find while creating a job posting.
                                        </p>
                                    </div>
                                </div>

                                <form
                                    className="mt-8 grid gap-5"
                                    onSubmit={handleSubmit(
                                        handleSkillCategory,
                                        (validationErrors) => console.error("Skill category validation failed:", validationErrors),
                                    )}
                                >
                                    <div className="grid gap-2">
                                        <label htmlFor="category-name" className="text-sm font-medium">Category name</label>
                                        <Input id="category-name" placeholder="e.g. Programming languages" 
                                        {...register("categoryName")}
                                        />
                                        {errors.categoryName && (
                                            <p className="text-sm text-destructive" role="alert">{errors.categoryName.message}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="category-description" className="text-sm font-medium">Description <span className="font-normal text-muted-foreground">(optional)</span></label>
                                        <Input id="category-description" placeholder="What belongs in this category?"
                                        {...register("description")}
                                         />
                                    </div>
                                    <Button type="submit" variant="outline" className="w-fit" disabled={isSubmitting}>
                                        <Plus aria-hidden="true" />
                                        {isSubmitting ? "Adding category..." : "Add category"}
                                    </Button>
                                    {categorySubmitError && (
                                        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                                            {categorySubmitError}
                                        </p>
                                    )}
                                    {categorySuccess && (
                                        <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400" role="status">
                                            <CheckCircle2 className="size-4" aria-hidden="true" />
                                            {categorySuccess}
                                        </p>
                                    )}
                                </form>

                                {categoriesError ? (
                                    <p className="mt-8 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                                        {categoriesError}
                                    </p>
                                ) : skillCategories.length > 0 ? (
                                    <div className="mt-8 flex flex-wrap gap-2" aria-label="Skill categories">
                                        {skillCategories.map((category) => (
                                            <span
                                                key={category.id}
                                                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/10"
                                                title={category.description ?? undefined}
                                            >
                                                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                                                {category.categoryName}
                                                <span className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-normal text-muted-foreground">
                                                    {category._count.skills}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-8 rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">
                                        No categories yet. Add your first category above.
                                    </p>
                                )}
                            </section>
                        </div>

                        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">Existing skills</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">Use this list for view, update, activate, and delete actions.</p>
                                </div>
                            </div>
                            {skillsError ? (
                                <p className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                                    {skillsError}
                                </p>
                            ) : isLoadingSkills ? (
                                <p className="mt-6 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                                    Loading skills...
                                </p>
                            ) : skills.length > 0 ? (
                                <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Existing skills">
                                    {skills.map((skill) => (
                                        <li key={skill.id} className="flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/20 px-4 py-3">
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">{skill.name}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{skill.category.categoryName}</p>
                                            </div>
                                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                skill.isActive
                                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                                    : "bg-muted text-muted-foreground"
                                            }`}>
                                                {skill.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-6 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                                    No skills yet. Add your first skill above.
                                </p>
                            )}
                        </section>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
