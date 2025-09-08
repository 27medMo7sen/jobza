"use client";
import AgencySignupForm from "@/components/auth/agencySignupForm";
import { DrawerOpt } from "@/components/auth/drawerOpt";
import EmployerSignupForm from "@/components/auth/employerSignupForm";
import GoogleFetch from "@/components/auth/googleFetch";
import LoginForm from "@/components/auth/loginForm";
import UserIdentity from "@/components/auth/userIdentity";
import WorkerSignupForm from "@/components/auth/workerSignupForm";
import { useSearchParams } from "next/navigation";
import { Fragment, useRef, Suspense } from "react";

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const drawerRef = useRef<HTMLButtonElement | null>(null);

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
      ) : mode == "google" ? (
        <GoogleFetch />
      ) : null}
      <DrawerOpt drawerRef={drawerRef} />
    </Fragment>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
