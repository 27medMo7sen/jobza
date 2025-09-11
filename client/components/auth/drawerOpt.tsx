import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
//   import { closeDrawer } from "@/lib/slices/uiSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import { setToken, setUser } from "@/lib/slices/authSlice";

export const DrawerOpt = ({
  drawerRef,
}: {
  drawerRef: React.RefObject<HTMLButtonElement | null>;
}) => {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState("");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const { post, isLoading } = useHttp();
  const router = useRouter();

  useEffect(() => {
    if (drawerRef.current) {
      // drawerRef.current.click();
    }
  }, [dispatch]);

  const handleChange = (val: string) => {
    setValue(val);
    setOtpError(null);
  };

  const redirectByRole = (role?: string) => {
    if (role === "worker") router.replace("/worker/dashboard");
    else if (role === "employer") router.replace("/employer/dashboard");
    else if (role === "agency") router.replace("/agency/dashboard");
    else if (role === "admin") router.replace("/admin/dashboard");
    else if (role === "superadmin") router.replace("/superadmin/dashboard");
    else router.replace("/");
  };

  React.useEffect(() => {
    if (value.length === 6) {
      const verifyEmail = async () => {
        try {
          const email =
            typeof window !== "undefined" &&
            typeof sessionStorage !== "undefined"
              ? sessionStorage.getItem("signupEmail")
              : null;
          if (!email) {
            setOtpError("Missing signup email; please signup again.");
            return;
          }
          await post("/auth/verify", {
            code: value,
            email,
          });

          // Auto-login after successful verification
          const password = sessionStorage.getItem("signupPassword") || "";
          const role = sessionStorage.getItem("signupRole") || undefined;
          const loginRes: any = await post("/auth/login", {
            email,
            password,
          });

          const token = loginRes?.token;
          const user = loginRes?.user || loginRes?.user?.user || loginRes;
          if (token) {
            localStorage.setItem("token", token);
            dispatch(setToken(token));
          }
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            dispatch(setUser(user));
          }

          // Navigate to dashboard by role
          redirectByRole(user?.role || role);
        } catch (e: any) {
          setOtpError("Invalid or expired code. Please try again.");
        }
      };
      verifyEmail();
    }
  }, [value]);

  return (
    <Drawer>
      <DrawerTrigger ref={drawerRef}></DrawerTrigger>
      <DrawerContent className="min-h-1/2">
        <DrawerHeader>
          <DrawerTitle>Confirm your Email</DrawerTitle>
          <DrawerDescription>
            Please check your email for a confirmation code to complete your
            registration. If you don't see it, check your spam folder or try
            resending the confirmation.
          </DrawerDescription>
          <div className="flex items-center justify-center mt-4">
            <InputOTP
              maxLength={6}
              value={value}
              onChange={handleChange}
              disabled={isLoading}
              className={`${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${otpError ? "border-red-500" : ""}`}
                />
                <InputOTPSlot
                  index={1}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${otpError ? "border-red-500" : ""}`}
                />
                <InputOTPSlot
                  index={2}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${otpError ? "border-red-500" : ""}`}
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${otpError ? "border-red-500" : ""}`}
                />
                <InputOTPSlot
                  index={4}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${otpError ? "border-red-500" : ""}`}
                />
                <InputOTPSlot
                  index={5}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${otpError ? "border-red-500" : ""}`}
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {otpError && (
            <p className="text-center text-sm text-red-600 mt-2">{otpError}</p>
          )}
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose className="text-blue-500 hover:underline">
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
