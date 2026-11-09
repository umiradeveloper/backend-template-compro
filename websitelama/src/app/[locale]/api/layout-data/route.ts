import { NextResponse } from "next/server";
import path from "path";
import { title } from "process";

const MenuData = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "About Us",
    path: "/about",
    newTab: false,
  },
  {
    id: 3,
    title: "Projects",
    path: "/projects",
    newTab: false,
  },
  {
    id: 4,
    title: "Blog",
    path: "/blog",
    newTab: false,
  },
  {
    id: 5,
    title: "Services",
    path: "/#services",
    newTab: false,
  },
  {
    id: 8,
    title: "Career",
    path: "/career",
    newTab: false,
  },
  {
    id: 6,
    title: "Contact",
    path: "/contact",
    newTab: false,
  },
  {
    id: 7,
    title: "System Information Management",
    path: "https://simumira.com/",
    newTab: false,
  },
];


const footerData = {
    name: "Umira Sinergi Global",
    tagline: "Build something together?",
    info: [
        {
            icon: "/images/footer/email-arrow.svg",
            link: "office@umiraglobal.com",
            href: "mailto:office@umiraglobal.com"
        },
        {
            icon: "/images/footer/Location.svg",
            link: "Head Office Yogyakarta",
            href: "https://maps.app.goo.gl/bivVqYQzxiisULLU9"
        },
        {
            icon: "/images/footer/Location.svg",
            link: "Jakarta Branch Office",
            href: "https://maps.app.goo.gl/vsiYLejAPVmNuJNi6"
        },
        {
            icon: "/images/footer/Location.svg",
            link: "Surabaya Branch Office",
            href: "https://maps.app.goo.gl/vSQywm5B2UkTcvxT8"
        },
        {
            icon: "/images/footer/Location.svg",
            link: "Bali Branch Office",
            href: "https://maps.app.goo.gl/Uj7bQKHDanSExv6w8"
        }
    ],
    links: [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Services", href: "/#services" },
        { name: "Work", href: "/projects" },
        { 
          name: "Company Profile", 
          href: "/docs/COMPRO_USG.pdf",
          download: true
        },
        // { name: "Company Profile", href: /public/docs/dummy.pdf},
        //{ name: "Terms", href: "/terms-and-conditions" },
        //{ name: "Privacy Policy", href: "/privacy-policy" },
        //{ name: "Error 404", href: "/not-found" }
    ],
    socialLinks: [
        { name: "Facebook", href: "https://www.facebook.com/umiraglobal" },
        { name: "Instagram", href: "https://www.instagram.com/umiraglobal" },
        { name: "Youtube", href: "https://youtube.com/@umiraglobal"},
        { name: "WhatsApp", href: "http://wa.me/6281539320248"}
    ],
    copyright: "© Umira Sinergi Global copyright 2025"
};

export const GET = async () => {
    return NextResponse.json({
        footerData,
        MenuData
    });
};