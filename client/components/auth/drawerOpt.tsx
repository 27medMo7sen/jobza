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
import { redirect } from "next/navigation";
export const DrawerOpt = ({
  drawerRef,
}: {
  drawerRef: React.RefObject<HTMLButtonElement | null>;
}) => {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState("");
  const { post, setIsLoading, isLoading, error } = useHttp();

  useEffect(() => {
    if (drawerRef.current) {
      // drawerRef.current.click();x
    }
  }, [dispatch]);
  const handleChange = (val: string) => {
    setValue(val);
    console.log(value);
  };
  React.useEffect(() => {
    if (value.length === 6) {
      const verifyEmail = async () => {
        const email =
          typeof window !== "undefined" && typeof localStorage !== "undefined"
            ? localStorage.getItem("verifyEmail")
            : null;
        const res = await post("/auth/verify", {
          code: value,
          email: email,
        });
        console.log("Email verified successfully:", res);
      };
      verifyEmail();
      redirect("/auth?mode=login");
    }
  }, [value]);
  useEffect(() => {
    console.log(error, isLoading);
  }, [error, isLoading]);
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
                  } ${error ? "border-red-500" : ""}`}
                />
                <InputOTPSlot
                  index={1}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${error ? "border-red-500" : ""}`}
                />
                <InputOTPSlot
                  index={2}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${error ? "border-red-500" : ""}`}
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${error ? "border-red-500" : ""}`}
                />
                <InputOTPSlot
                  index={4}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${error ? "border-red-500" : ""}`}
                />
                <InputOTPSlot
                  index={5}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "border-input"
                  } ${error ? "border-red-500" : ""}`}
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
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
