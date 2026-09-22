import AppHeader from "../UI/AppHeader";
import {  AddSquareIcon, AddTeamIcon } from '@hugeicons/core-free-icons';
import { OrgOnboardingCard } from "@/components/organization-card";

export default function OnboardingOrganization() {
    return (
        <>
        <AppHeader/>
        <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 px-6 py-12 sm:flex-row">
            <OrgOnboardingCard
                title="Join an organization"
                description="Join your existing organization and start collaborating with your team."
                route="/onboarding/organization/join"
                icon={AddTeamIcon}
            />
            <OrgOnboardingCard
                title="Create an organization"
                description="Create a new organization so your team can join you later."
                route="/onboarding/organization/create"
                icon={AddSquareIcon}
            />
        </main>
        </>
    )
}