import { api } from '@/api/api';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useTeamMembersStore } from '@/store/useTeamMembersStore';
import { useSession } from '@repo/auth';
import UserProfileWithStats from '@repo/ui/components/blocks/application/user-profiles/with-stats';
import { useEffect, useState } from 'react';

type UserDataResponse = {
    name: string;
    email: string;
    imageUrl: string | null;
    createdAt: string | Date;
}

export default function UserAccount() {
    const [userData, setUserData] = useState<UserDataResponse>({
        name: "",
        email: "",
        imageUrl: null,
        createdAt: ""
    })

    const { details, fetchOrganizationDetails } = useOrganizationStore();
    const currentOrganization = details?.name;
    const { teamMembers, getTeamMembers } = useTeamMembersStore();
    const { data: session } = useSession();
    const userId = session?.user.id;
    const currentMember = teamMembers.find((member) => member.id === userId);
    const role = currentMember?.role;

    console.log('Role: ', role);

    // console.log('Org: ', details);

    async function getUserDetails() {
        try {
            const response = await api.get('api/user/get-details');

            if(response.status === 200) {
                setUserData(response.data.user);
            }

        } catch(error) {
            console.error("ERROR: ", error);
            return;
        }
    }

    useEffect(() => {
        getUserDetails();
        getTeamMembers();
        fetchOrganizationDetails();
    }, [])
    return (
        <>
        <UserProfileWithStats name={userData.name} organization={currentOrganization ?? 'Not assigned'} department='IT' role={role ?? 'Not assigned'} email={userData.email} imageUrl={userData.imageUrl} memberSince={userData.createdAt}/>
        </>
    )
}