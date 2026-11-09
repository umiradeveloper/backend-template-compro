

import { Metadata } from "next";
import { useTranslations } from "next-intl";
import AboutSite from "@/app/[locale]/(site)/about/aboutSite";
export const metadata: Metadata = {
    title: "About Us | Umira Sinergi Global",
};

export default function Page() {
    const t = useTranslations("AboutHero");
    return (
        <>
        <AboutSite />
        </>
    );
};
