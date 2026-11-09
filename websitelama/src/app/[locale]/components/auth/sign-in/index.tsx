"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialSignIn from "../SocialSignIn";
import Image from "next/image";
import Loader from "../../shared/loader";

const Signin = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    }); //login data state

    const [validationErrors, setValidationErrors] = useState({
        email: "",
        password: "",
    }); //validation state

    // Input validation function
    const validateForm = () => {
        let errors = { email: "", password: "" };
        let isValid = true;

        if (!loginData.email) {
            errors.email = "Email is required.";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
            errors.email = "Please enter a valid email address.";
            isValid = false;
        }

        if (!loginData.password) {
            errors.password = "Password is required.";
            isValid = false;
        } else if (loginData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long.";
            isValid = false;
        }
        setValidationErrors(errors);
        return isValid;
    };

    // form handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            localStorage.setItem("user", JSON.stringify({ user: loginData.email }));
            router.push("/");
        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <div className="relative border-t-4 border-primary w-full bg-lightgray dark:bg-secondary h-screen flex items-center justify-center">
                <div className="container">
                    <div className="flex flex-wrap">
                        <div className="w-full">
                            <div className="relative shadow-xl mx-auto max-w-lg overflow-hidden bg-white dark:bg-darkblack px-8 py-14 text-center sm:px-12 md:px-16">
                                <Link href={"/"} className="mb-10 flex justify-center">
                                    <Image src={"/images/logo/logo-black.svg"} alt="Image" width={187} height={30} className="dark:hidden"/>
                                    <Image src={"/images/logo/WhiteLogo.svg"} alt="Image" width={187} height={30} className="hidden dark:block"/>
                                </Link>

                                <SocialSignIn actionText="Sign In" />

                                <span className="z-1 relative my-8 block text-center">
                                    <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-secondary/12 dark:bg-white/12"></span>
                                    <span className="text-sm text-secondary/50 dark:text-white/50 relative z-10 inline-block bg-white dark:bg-darkblack px-3">
                                        OR
                                    </span>
                                </span>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3 text-left">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, email: e.target.value })
                                            }
                                            className={`w-full border-b border-secondary/20 px-2 py-3 outline-none transition dark:border-white/20
                                                ${validationErrors.email ? 'border-red-500' : 'border-stroke'} 
                                                focus:border-secondary/60 dark:focus:border-primary`}
                                        />
                                        {validationErrors.email && (
                                            <p className="text-red-500 dark:text-red-500 text-sm mt-1">{validationErrors.email}</p>
                                        )}
                                    </div>
                                    <div className="mb-2 text-left">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, password: e.target.value })
                                            }
                                            className={`w-full border-b border-secondary/20 px-2 py-3 outline-none transition dark:border-white/20
                                                ${validationErrors.email ? 'border-red-500' : 'border-stroke'} 
                                                focus:border-secondary/60 dark:focus:border-primary`}
                                        />
                                        {validationErrors.password && (
                                            <p className="text-red-500 dark:text-red-500 text-sm mt-1">{validationErrors.password}</p>
                                        )}
                                    </div>
                                    <div className="my-9">
                                        <button
                                            type="submit"
                                            className="flex w-full px-5 py-3 font-medium cursor-pointer items-center justify-center transition duration-300 ease-in-out rounded-full border border-secondary dark:border-white/90 bg-secondary dark:bg-white/90 hover:bg-transparent text-white dark:text-secondary hover:text-secondary dark:hover:text-white"
                                        >
                                            Sign In {loading && <Loader />}
                                        </button>
                                    </div>
                                </form>

                                <Link
                                    href="/forgot-password"
                                    className="mb-1 inline-block"
                                >
                                    <span className="font-medium text-secondary/70 dark:text-white/70 hover:text-secondary dark:hover:text-primary">Forget Password?</span>
                                </Link>
                                <p className="text-base font-medium text-secondary/70 dark:text-white/70">
                                    Not a member yet?{" "}
                                    <Link href="/signup" className="text-secondary/70 dark:text-white/70 hover:text-secondary dark:hover:text-primary">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signin;
