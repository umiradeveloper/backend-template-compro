"use client";
import React, { useState } from "react";
import Image from "next/image";
import Loader from "../../shared/loader";
import Backbutton from "../../shared/back-button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loader, setLoader] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to validate email
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required.");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format.");
      return false;
    }
    const domain = value.split("@")[1];
    setEmailError(""); // Clear error if valid
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      setIsEmailSent(true);
    }, 2000);
  };

  return (
    <section>
      <div className="relative w-full bg-lightgray dark:bg-secondary h-screen flex items-center justify-center">
        <div className="container">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="relative shadow-xl mx-auto max-w-lg overflow-hidden bg-white dark:bg-darkblack px-8 py-14 text-center sm:px-12 md:px-16">
                <div className="mb-10 flex justify-center">
                  <Image src={"/images/logo/logo-black.svg"} alt="Image" width={187} height={30} className="dark:hidden" />
                  <Image src={"/images/logo/WhiteLogo.svg"} alt="Image" width={187} height={30} className="hidden dark:block" />
                </div>

                {isEmailSent ? (
                  <div className="flex flex-col items-center gap-5">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-secondary dark:text-white font-bold">
                        Forgot Your Password?
                      </h4>
                      <p className="text-secondary/60 dark:text-white/60">
                        Please check your inbox for the new password.
                      </p>
                    </div>
                    <Backbutton />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-5 text-left">
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          validateEmail(e.target.value);
                        }}
                        required
                        className="w-full border-b border-secondary/20 px-5 py-3 outline-none transition dark:border-white/20 focus:border-secondary/60 dark:focus:border-primary"
                      />
                      {emailError && (
                        <p className="text-red-500 text-sm mt-1">{emailError}</p>
                      )}
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="flex w-full px-5 py-3 font-medium cursor-pointer items-center justify-center transition duration-300 ease-in-out rounded-full border border-secondary dark:border-white/90 bg-secondary dark:bg-white/90 hover:bg-transparent text-white dark:text-secondary hover:text-secondary dark:hover:text-white"
                        disabled={loader}
                      >
                        {loader ? <Loader /> : "Send Email"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
