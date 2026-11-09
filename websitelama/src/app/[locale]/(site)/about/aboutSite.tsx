"use client";
import AboutusDetail from "@/app/[locale]/components/about/aboutus-detail";
import Herobanner from "@/app/[locale]/components/shared/hero-banner";
import AboutusStats from "@/app/[locale]/components/about/aboutus-stats";
import AboutusFullimg from "@/app/[locale]/components/about/aboutus-fullimg";
import { useTranslations } from "next-intl";


const AboutSite = () => {
    const t = useTranslations("AboutHero");
    return(
        <main>
            <Herobanner
                bannerimage="/images/about-us/banner/teamphoto.png"
                heading= {t("heading")}
                desc={t("desc")}/>
            <AboutusDetail />
            <AboutusStats />
            <AboutusFullimg />
            {/*<Team teamdataNumber="01" />*/}
        </main>
    )
};

export default AboutSite;