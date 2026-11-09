import React from "react";
import { signIn } from "next-auth/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const SocialSignIn = ({ actionText = "Sign In" }) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:flex items-center">
            <button
                onClick={() => signIn("google")}
                className="flex w-full items-center justify-center cursor-pointer gap-2.5 rounded-full border border-secondary/12 dark:border-white/12 p-3 hover:bg-secondary/5 dark:hover:bg-white/5">
                <span className="text-secondary dark:text-white font-medium">{actionText}</span>
                <Icon icon="flat-color-icons:google" width="22" height="22" />
            </button>

            <button
                onClick={() => signIn("github")}
                className="flex w-full items-center justify-center cursor-pointer gap-2.5 rounded-full border border-secondary/12 dark:border-white/12 p-3 hover:bg-secondary/5 dark:hover:bg-white/5"
            >
                <span className="text-secondary dark:text-white font-medium">{actionText}</span>
                <Icon icon="logos:github-icon" width="22" height="22" />
            </button>
        </div>
    );
};

export default SocialSignIn;
