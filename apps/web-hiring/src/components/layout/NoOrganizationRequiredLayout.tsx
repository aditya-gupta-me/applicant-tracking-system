import { Navigate, Outlet } from "react-router-dom";
import { useOrganizationStore } from "@/store/useOrganizationStore";
import Loading from "../Loading";

export function NoOrganizationRequiredLayout() {
    const { organization, isLoading } = useOrganizationStore();

    console.log(organization);
    if(isLoading) {
        return <Loading/>;
    }

    if(organization) {
        return <Navigate 
        to={'/dashboard'}
        replace
        />
    }

    return <Outlet/>;
}