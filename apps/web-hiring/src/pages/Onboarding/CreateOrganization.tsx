import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { useForm } from "react-hook-form";
import { createOrganizationSchema, type OrganizationInput } from "@repo/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { email, z } from "zod";
import axios from "axios";

export default function CreateOrganization() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<z.input<typeof createOrganizationSchema>, unknown, OrganizationInput>({
        resolver: zodResolver(createOrganizationSchema),
        mode: "onChange"
    })

    const navigate = useNavigate();

    async function onSubmit(data: OrganizationInput) {
        // LOG
        console.log("Validated: ", data);

        // console.log("ENV: ", import.meta.env.VITE_API_BASE_URL)
        const res = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/organization/create', {
            name: data.name,
            website: data.website,
            email: data.email,
            establishedDate: data.establishedDate
        });

        console.log(res);

        if(res.status !== 200){
            console.error(res.data.error);
            return;
        }

        console.log('Organization created successfully!')
        navigate('/dashboard');        
    }
    return (
        <>
            <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-12">
                <Card className="w-full max-w-xl">
                    <CardHeader>
                        <Link
                            to="/onboarding/organization"
                            className="-ml-3 mb-2 inline-flex w-fit items-center gap-1.5 rounded-4xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                            <ArrowLeft aria-hidden="true" className="size-4" />
                            Back
                        </Link>
                        <CardTitle className="text-2xl">Create an organization</CardTitle>
                        <CardDescription>
                            Add your organization details so your team can find the right workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="organization-name">Organization name</FieldLabel>
                                    <Input
                                        id="organization-name"
                                        type="text"
                                        placeholder="Google LLC"
                                        autoComplete="organization"
                                        {...register("name")}
                                    />
                                    {errors.name && <p style={{color: "red"}}>{errors.name.message}</p>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="organization-website">Website</FieldLabel>
                                    <Input
                                        id="organization-website"
                                        type="url"
                                        placeholder="https://google.com"
                                        autoComplete="url"
                                        inputMode="url"
                                        {...register("website")}
                                    />
                                    {errors.website && <p style={{color: "red"}}>{errors.website.message}</p>}
                                    <FieldDescription>Use your organization&apos;s public website.</FieldDescription>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="organization-email">Email</FieldLabel>
                                    <Input
                                        id="organization-email"
                                        type="email"
                                        placeholder="support-in@google.com"
                                        autoComplete="email"
                                        {...register("email")}
                                    />
                                    {errors.email && <p style={{color: "red"}}>{errors.email.message}</p>}
                                    <FieldDescription>We&apos;ll use this as the primary organization contact.</FieldDescription>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="established-date">Established date</FieldLabel>
                                    <Input
                                        id="established-date"
                                        type="date"
                                        {...register("establishedDate")}
                                    />
                                    {errors.establishedDate && <p style={{color: "red"}}>{errors.establishedDate.message}</p>}
                                </Field>
                                <Button type="submit" className="w-full">
                                    Create organization
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}