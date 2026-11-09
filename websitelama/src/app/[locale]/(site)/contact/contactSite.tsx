"use client";
import Contact from "@/app/[locale]/components/home/contact";
import Herobanner from "@/app/[locale]/components/shared/hero-banner";
import { useTranslations } from "next-intl";


export default function Page() {
    const t = useTranslations("ContactSection");
    return (
        <main>
            <Herobanner
                bannerimage="/images/contact/banner/contact-banner.png"
                heading={t("heading")}
                desc= {t("headingdesc")} />
            <Contact contactdataNumber="01"/>
        </main>
    );
};
