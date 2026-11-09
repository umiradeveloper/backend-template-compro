"use client";
import { useTranslations } from "next-intl";
import Herobanner from "../../components/shared/hero-banner";

const HeroBannerBlog = () => {
    const t = useTranslations("BlogSection");
    return(
        <Herobanner
                bannerimage="/images/blog/banner/blog_banner.JPG"
                heading={t("heading")}
                desc={t("headingdesc")}/>
    )

}
export default HeroBannerBlog;