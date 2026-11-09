import { Configuration } from "@/app/[locale]/components/documentation/Configuration";
import { DocNavigation } from "@/app/[locale]/components/documentation/DocNavigation";
import { Introduction } from "@/app/[locale]/components/documentation/Introduction";
import { PackageStructure } from "@/app/[locale]/components/documentation/PackageStructure";
import { QuickStart } from "@/app/[locale]/components/documentation/QuickStart";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation | Studiova",
};

export default function Page() {
    return (
        <div>
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md p-6 lg:mt-28 mt-16 !pt-10">
                <div className="grid grid-cols-12 gap-6">
                    <div className="lg:col-span-3 col-span-12 lg:block hidden">
                        <DocNavigation />
                    </div>
                    <div className="lg:col-span-9 col-span-12">
                        <Introduction />
                        <PackageStructure />
                        <QuickStart />
                        <Configuration />
                    </div>
                </div>
            </div>
        </div>
    );
};
