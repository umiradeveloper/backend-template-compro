"use client";
import { useTranslations } from "next-intl";
import Herobanner from "../../components/shared/hero-banner";

const HeroBannerCareer = () => {
    const t = useTranslations("CareerSection");
    return(
        <Herobanner
                bannerimage="/images/blog/banner/blog_banner.JPG"
                heading={t("heading")}
                desc={t("headingdesc")}/>
    )

}
export default HeroBannerCareer;