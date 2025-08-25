"use client";
import AgencySignupForm from "@/components/auth/agencySignupForm";
import EmployerSignupForm from "@/components/auth/employerSignupForm";
import LoginForm from "@/components/auth/loginForm";
import UserIdentity from "@/components/auth/userIdentity";
import WorkerSignupForm from "@/components/auth/workerSignupForm";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <Fragment>
      {!mode ? (
        <UserIdentity />
      ) : mode === "workerSignup" ? (
        <WorkerSignupForm />
      ) : mode === "employerSignup" ? (
        <EmployerSignupForm />
      ) : mode === "agencySignup" ? (
        <AgencySignupForm />
      ) : mode === "login" ? (
        <LoginForm />
      ) : null}
    </Fragment>
  );
}
