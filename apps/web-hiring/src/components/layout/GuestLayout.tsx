import { useSession } from "../../lib/auth-client";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../Loading";

export function GuestLayout() {
    const { data: session, isPending } = useSession();
    const location = useLocation();

    if(isPending){
        return <Loading/>;
    }

    if(session){
        return <Navigate
        to={'/dashboard'}
        replace
        state={{ from: location }}
        />
    }

    return <Outlet/>
}