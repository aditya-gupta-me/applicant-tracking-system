import { Navigate, Outlet } from "react-router-dom";
import Loading from "../Loading";
import { useAdminStore } from "@/store/useAdminStore";

export function AdminLayout() {
    const { admin, isLoading } = useAdminStore();

    if(isLoading) {
        return <Loading/>;
    }

    if(!admin) {
        return <Navigate 
        to={'/dashboard'}
        replace
        />
    }

    return <Outlet/>;
}