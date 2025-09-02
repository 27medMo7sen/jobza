"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHttp } from "@/hooks/use-http";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/lib/slices/authSlice";
export default function GoogleFetch() {
    const {get} = useHttp();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const router = useRouter(); 
    useEffect(() => {
        const token = searchParams.get("token");    
        dispatch(setToken(token as string));
        const getUserByToken = async () => {
        const user = await get("/auth/user-by-token");
        dispatch(setUser(user));
        console.log("that's the user",user);
    }
    getUserByToken();
    // router.push('/')
   }, [])

    return (
        <div>
            <h1>Google Fetch</h1>
        </div>
    )
}