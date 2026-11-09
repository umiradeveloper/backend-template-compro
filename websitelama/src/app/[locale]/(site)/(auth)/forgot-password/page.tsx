import React from "react";
import { Metadata } from "next";
import ForgotPassword from "@/app/[locale]/components/auth/forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password | Studiova Next.js",
};

const ForgotPasswordPage = () => {
  return (
    <>
      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordPage;
