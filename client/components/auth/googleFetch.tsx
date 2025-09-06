"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHttp } from "@/hooks/use-http";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/lib/slices/authSlice";
import type { User } from "@/types/user";
export default function GoogleFetch() {
  const { get } = useHttp();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const token = searchParams.get("token");
    console.log("tokenmmmmmmmmmmmmmm", token);
    dispatch(setToken(token as string));

    const getUserByToken = async () => {
      const user = await get<User>("/auth/user-by-token");
      dispatch(setUser(user));
      console.log("that's the user", user);
      if (!user) {
        router.push("/login");
      }
      if (user?.role === "worker") {
        router.push("/worker/dashboard");
      } else if (user?.role === "employer") {
        router.push("/employer/dashboard");
      } else if (user?.role === "agency") {
        router.push("/agency/dashboard");
      }
    };
    getUserByToken();
  }, []);

  return (
    <div>
      <h1>Google Fetch</h1>
    </div>
  );
}
