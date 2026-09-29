import { api } from "@/api/api";
import AppHeader from "../UI/AppHeader";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function JoinOrganization() {
    const { inviteToken } = useParams();
    const [error, setError] = useState("");

    async function joinOrganization() {
        const res = await api.post('api/organization/join', {
            inviteToken
        })

        if(res.status !== 200){
            setError(res.data.error);
            console.log(res.data.error);
            return;
        }

        alert(res.data.message);
        return res.data;
    }

    useEffect(() => {
        joinOrganization();
    }, [])
    return (
        <>
        <AppHeader/>
        <p>
            The params are: {inviteToken}
        </p>

        {error && <p>{error}</p>}
        </>
    )
}