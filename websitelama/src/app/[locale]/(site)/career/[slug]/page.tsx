import Herobanner from "@/app/[locale]/components/shared/hero-banner";
import { getCareerBySlugCms } from "@/lib/cms";
import markdownToHtml from "@/lib/markdownToHtml";
import Image from "next/image";

type Props = {
    params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug, locale } = await params;

    const career = await getCareerBySlugCms(slug, ["title", "detail", "date", "coverImage", "scrolltoread", "description", "galleryImg", "content"], locale);

    const siteName = process.env.SITE_NAME || "Umira Sinergi Global";
    const authorName = process.env.AUTHOR_NAME || "Admin";

    if (career) {
        return {
            title: `${career.title || "Single Post Page"} | ${siteName}`,
            robots: {
                index: true,
                follow: true,
                nocache: true,
                googleBot: {
                    index: true,
                    follow: false,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
        };
    } else {
        return {
            title: "Not Found",
            description: "No Career has been found",
            author: authorName,
            robots: {
                index: false,
                follow: false,
                nocache: false,
                googleBot: {
                    index: false,
                    follow: false,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
        };
    }
}

export default async function Post({ params }: Props) {
    const { slug, locale } = await params;
    const career = await getCareerBySlugCms(slug, ["title", "detail", "date", "coverImage", "scrolltoread", "description", "galleryImg", "content"], locale);

    const content = await markdownToHtml(career.content || "");

    return (
        <>
            <section>
                <div>
                    <Herobanner
                        bannerimage={career?.coverImage}
                        heading={career?.title}
                        desc={career?.detail}
                        headingClass="blog-heading" />
                </div>
                <div className="dark:bg-darkblack">
                    <div className="container">
                        <div className="flex flex-col gap-12 md:gap-24 py-20 xl:py-40">
                            <div className="flex flex-col xl:flex xl:flex-row items-start xl:items-center gap-8">
                                <div className="flex items-center gap-4 md:gap-8 w-full max-w-xl">
                                    <h2 className="text-4xl lg:text-5xl xl:text-56">Scroll to read</h2>
                                </div>
                                <p className="text-secondary/70 dark:text-white/70">{career?.scrolltoread}</p>
                            </div>
                            <div className="w-full aspect-square">
                                <Image src={career?.galleryImg} alt="Image" width={720} height={720} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex justify-end">
                                {content && (
                                    <div dangerouslySetInnerHTML={{ __html: content }} className="blog-content max-w-6xl"></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}