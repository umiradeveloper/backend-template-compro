"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SocialSignIn from "../SocialSignIn";
import { useState } from "react";
import Image from "next/image";
import Loader from "../../shared/loader";

const SignUp = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
    });

    // Validation functions
    const validateName = (name: string) => {
        if (!name.trim()) return "Name is required";
        if (!/^[a-zA-Z\s]{3,}$/.test(name)) return "Name must be at least 3 characters and contain only letters";
        return "";
    };

    const validateEmail = (email: string) => {
        if (!email.trim()) return "Email is required";
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return "Enter a valid email address";
        return "";
    };

    const validatePassword = (password: string) => {
        if (!password.trim()) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Validate on change
        setErrors((prev) => ({
            ...prev,
            [name]: name === "name"
                ? validateName(value)
                : name === "email"
                    ? validateEmail(value)
                    : validatePassword(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate all fields before submitting
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        setErrors({ name: nameError, email: emailError, password: passwordError });
        if (nameError || emailError || passwordError) {
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            localStorage.setItem("user", JSON.stringify({ user: formData.name }));
            router.push("/");
        } catch (error) {
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
                                    <Image src={"/images/logo/logo-black.svg"} alt="Image" width={187} height={30} className="dark:hidden" />
                                    <Image src={"/images/logo/WhiteLogo.svg"} alt="Image" width={187} height={30} className="hidden dark:block" />
                                </Link>

                                <SocialSignIn actionText="Sign Up" />

                                <span className="z-1 relative my-8 block text-center">
                                    <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-secondary/12 dark:bg-white/12"></span>
                                    <span className="text-sm text-secondary/50 dark:text-white/50 relative z-10 inline-block bg-white dark:bg-darkblack px-3">
                                        OR
                                    </span>
                                </span>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3 text-left">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full border-b border-secondary/20 px-2 py-3 outline-none transition dark:border-white/20
                                                ${errors.email ? 'border-red-500' : 'border-stroke'} 
                                                focus:border-secondary/60 dark:focus:border-primary`}
                                        />
                                        {errors.name && <p className="text-red-500 dark:text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div className="mb-3 text-left">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full border-b border-secondary/20 px-2 py-3 outline-none transition dark:border-white/20
                                                ${errors.email ? 'border-red-500' : 'border-stroke'} 
                                                focus:border-secondary/60 dark:focus:border-primary`}
                                        />
                                        {errors.email && <p className="text-red-500 dark:text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    <div className="mb-5 text-left">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full border-b border-secondary/20 px-2 py-3 outline-none transition dark:border-white/20
                                                ${errors.email ? 'border-red-500' : 'border-stroke'} 
                                                focus:border-secondary/60 dark:focus:border-primary`}
                                        />
                                        {errors.password && <p className="text-red-500 dark:text-red-500 text-sm mt-1">{errors.password}</p>}
                                    </div>
                                    <div className="my-9">
                                        <button
                                            type="submit"
                                            className="flex w-full px-5 py-3 font-medium cursor-pointer items-center justify-center transition duration-300 ease-in-out rounded-full border border-secondary dark:border-white/90 bg-secondary dark:bg-white/90 hover:bg-transparent text-white dark:text-secondary hover:text-secondary dark:hover:text-white"
                                            disabled={loading}
                                        >
                                            Sign Up {loading && <Loader />}
                                        </button>
                                    </div>
                                </form>

                                <div className="flex flex-col max-w-xs mx-auto gap-2">
                                    <p className="text-base font-medium text-secondary/70 dark:text-white/70">
                                        By creating an account, you agree with our{" "}
                                        <Link href="/privacy-policy" className="text-secondary/70 dark:text-white/70 hover:text-secondary dark:hover:text-primary">
                                            Privacy
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy-policy" className="text-secondary/70 dark:text-white/70 hover:text-secondary dark:hover:text-primary">
                                            Policy
                                        </Link>.
                                    </p>

                                    <p className="text-base font-medium text-secondary/70 dark:text-white/70">
                                        Already have an account?
                                        <Link href="/signin" className="text-secondary/70 dark:text-white/70 hover:text-secondary dark:hover:text-primary">
                                            {" "}Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
