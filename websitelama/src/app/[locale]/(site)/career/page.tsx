import CareerList from "@/app/[locale]/components/career/career-list";
import Herobanner from "@/app/[locale]/components/shared/hero-banner";
import { Metadata } from "next";
import HeroBannerCareer from "./HeroBannerCareer";

export const metadata: Metadata = {
    title: "Career | Umira Sinergi Global",
};

export default function Page() {
    return (
        <main>
                <HeroBannerCareer />
                <CareerList/>
        </main>
    );
};