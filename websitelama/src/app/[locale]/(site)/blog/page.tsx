
import BlogList from "@/app/[locale]/components/blog/blog-list";
import Herobanner from "@/app/[locale]/components/shared/hero-banner";
import { Metadata } from "next";
import HeroBannerBlog from "./HeroBannerBlog";

export const metadata: Metadata = {
    title: "Bulletin | Umira Sinergi Global",
};

export default function Page() {
    return (
        <main>
                <HeroBannerBlog />
                <BlogList/>
        </main>
    );
};