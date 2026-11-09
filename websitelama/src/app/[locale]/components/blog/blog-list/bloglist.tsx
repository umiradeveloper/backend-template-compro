"use client";
import Image from "next/image";
import {Link} from "@/navigation";
import { useParams } from "next/navigation";

const BlogListMarkdown = ({Blogs, locale}: any)=> {
    const param: any = useParams();
    console.log(param.locale);
    return(
         <section className="dark:bg-darkblack py-20 md:py-40">
            <div className="flex flex-col gap-24">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {Blogs.map((value: any, index: any) => {

                            const formattedDate = new Date(value.date).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            });

                            return (
                                <Link href={`/blog/${value.slug}`} key={index} className="group flex flex-col gap-3" locale={param.locale}>
                                    <div className="group flex flex-col gap-5">
                                        <div className="w-full h-35 overflow-hidden group">
                                            <Image
                                                src={value.coverImage}
                                                alt="image"
                                                width={805}
                                                height={805}
                                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-secondary/70 dark:text-white/70">{formattedDate}</span>
                                            <h4>{value.title}</h4>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
export default BlogListMarkdown;