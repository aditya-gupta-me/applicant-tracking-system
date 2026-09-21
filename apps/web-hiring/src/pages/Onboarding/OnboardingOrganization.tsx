import AppHeader from "../UI/AppHeader";
import { Pattern } from "@repo/ui/components/examples/c-card-17"
import {  AddSquareIcon, AddTeamIcon } from '@hugeicons/core-free-icons';

export default function OnboardingOrganization() {
    return (
        <>
        <AppHeader/>
        <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 px-6 py-12 sm:flex-row">
            <Pattern
                title="Join an organization"
                description="Join your existing organization and start collaborating with your team."
                href="/onboarding/organization/join"
                icon={AddTeamIcon}
            />
            <Pattern
                title="Create an organization"
                description="Create a new organization so your team can join you later."
                href="/onboarding/organization/create"
                icon={AddSquareIcon}
            />
        </main>
        </>
    )
}