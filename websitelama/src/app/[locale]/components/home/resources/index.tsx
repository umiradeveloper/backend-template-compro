
"use client"
import { useParams } from "next/navigation";
// import { getAllBlogs } from "@/lib/blogmarkdown";
// import { useLocale, useTranslations } from "next-intl";
// import Image from "next/image";
// import {Link} from "@/navigation";
import ResourcesBlog from "./resourcesblog";
import { useEffect, useState } from "react";

// type Blog = {
//     title: string;
//     slug: string;
//     date: string;
//     coverImage: string;
// };
const Resources = () => {
    const param: any = useParams();
    const [blogs, setBlogs] = useState([]);
    const fetchData = async () => {
        try {
            const res = await fetch('/api/blogs-data?locale='+param.locale)
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json();
            // console.log(data)
            setBlogs(data)
        } catch (error) {
            console.error('Error fetching services:', error)
        }
    }
    useEffect(() => {
        fetchData();
    },[])

    // const locale = useLocale();
    // // const t= useTranslations("BlogSection");
    // // const param: any = useParams();
    // const blogs: Blog[] = getAllBlogs(["title", "slug", "coverImage", "date"], locale)
    //     .sort((a, b) => {
    //         return new Date(b.date).getTime() - new Date(a.date).getTime();
    //     });

    return (
        <>
        <ResourcesBlog blogs={blogs} />
        </>
    );
}

export default Resources;
