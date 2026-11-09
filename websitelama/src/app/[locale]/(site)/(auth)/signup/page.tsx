import { Metadata } from "next";
import SignUp from "@/app/[locale]/components/auth/sign-up";

export const metadata: Metadata = {
  title:
    "Sign Up | Studiova",
};

const SignupPage = () => {
  return (
    <>
      <SignUp />
    </>
  );
};

export default SignupPage;
