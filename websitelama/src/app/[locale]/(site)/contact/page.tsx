import { Metadata } from "next";
import { useTranslations } from "next-intl";
import ContactSite from "@/app/[locale]/(site)/contact/contactSite";
export const metadata: Metadata = {
    title: "Contact Us | Umira Sinergi Global",
};

export default function Page() {
    const t = useTranslations("ContactSection");
    return (
        <>
        <ContactSite />
        </>
    );
};
