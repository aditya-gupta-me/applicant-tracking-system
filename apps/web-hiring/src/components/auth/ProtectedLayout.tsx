import { useSession } from "@repo/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom"
import Loading from "../Loading";

export function ProtectedRoute() {
    const { data: session, isPending } = useSession();
    const location = useLocation();

    if(isPending){
        return <Loading/>;
    }

    if(!session){
        return <Navigate
        to={'/login'}
        replace
        state={{ from: location }}
        />
    }

    return <Outlet/>;
}