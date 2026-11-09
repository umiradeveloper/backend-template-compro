// import { getAllBlogs } from "@/lib/blogmarkdown";
// import { useLocale } from "next-intl";
"use client"
import { useParams } from "next/navigation";
import BlogListMarkdown from "./bloglist";
import { useEffect, useState } from "react";
// import { getLocale } from "next-intl/server";

const BlogList = () => {
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

    return (
       <BlogListMarkdown Blogs={blogs} Locale={param.locale}/>

    );
};

export default BlogList;