import ProjectList from "@/app/[locale]/components/projects";
import Herobanner from "@/app/[locale]/components/shared/hero-banner";
import { getProjectsCms } from "@/lib/cms";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
    params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
    title: "Projects | Umira Sinergi Global",
};

export default async function Page({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "PortfolioSection" });

    const projects = await getProjectsCms(locale);

    return (
        <main>
            <Herobanner
                bannerimage="/images/projects/banner/projects-banner.png"
                heading={t("heading")}
                desc={t("headingdesc")} />
            <ProjectList projects={projects} locale={locale} />
        </main>
    );
};