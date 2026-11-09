import { NextResponse } from "next/server";

const avatarList = [
    {
        image: "/images/avatar/avatar_1.jpg",
        title: "Sarah Johnson"
    },
    {
        image: "/images/avatar/avatar_2.jpg",
        title: "Olivia Miller"
    },
    {
        image: "/images/avatar/avatar_3.jpg",
        title: "Sophia Roberts"
    },
    {
        image: "/images/avatar/avatar_4.jpg",
        title: "Isabella Clark"
    },
];

const statsFactData = {
    number: '01',
    name: "Stats",
    heading: "Build Your Future and Investment",
    description: "with Structural Excellence in Your Dream Place",
    scoreData: [
        {
            number: 24,
            scoreDescp: "Years Of Experiences "
        },
        {
            number: 50,
            scoreDescp: "Clients that We nurture connections beyond client interests"
        },
        {
            number: 47256,
            numberValue: 'm²',
            scoreDescp: "The project consists of a total of 429 villa units and 1 hotel. The combined total land area for the villas and hotel amounts to 47,256.64 m²."
        },
    ]
};

const servicesData = {
    number: '03',
    name: "Services",
    heading: "What we do",
    description: "From planning to construction, we’re here to support your needs. Discover our services and how we deliver reliable solutions.",
    data: [
        {
            id: 1,
            image: "/images/home/services/foundation.png",
            heading: "Foundation & Building Construction",
            descp: "We specialize in strong foundations and high-quality buildings that meet top industry standards."
        },
        {
            id: 2,
            image: "/images/home/services/architecture.png",
            heading: "Civil Construction & Architecture",
            descp: "We craft innovative and resilient solutions in civil construction and architecture, shaping spaces that stand the test of time."
        },
        {
            id: 3,
            image: "/images/home/services/interior.png",
            heading: "Interior Works",
            descp: "We craft exclusive, luxurious interiors that blend opulence with refined functionality, creating spaces that redefine elite living."
        },
    ]
};

const testimonialData = {
    data_1: {
        preTitle: "Hear from them",
        title: "Our website redesign was flawless. They understood our vision perfectly!",
        author: "Albert Flores",
        company: "MasterCard"
    },
    data_2: {
        preTitle: "Hear from them",
        title: "From concept to execution, they delivered outstanding results. Highly recommend their expertise!",
        author: "Robert Fox",
        company: "Mitsubishi"
    },
    data_3: {
        preTitle: "Hear from them",
        title: "Super smooth process with incredible results. highly recommend!",
        author: "Jenny Wilson",
        company: "Pizza Hut"
    },
};

const teamData = {
    number: '06',
    data: [
        {
            image: "/images/home/team/team-img.jpg",
            name: "Fauzie Pohan",
            position: "Chief Executive Officer",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/team-img.jpg",
            name: "Muhammad Iqbal",
            position: "Chief Finance Officer",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/team-img.jpg",
            name: "Ahmad Fauzi",
            position: "Chief Operative Officer",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/team-img.jpg",
            name: "Muhammad Hari Wijaya",
            position: "Chief Technology Officer",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    link: "https://linkedin.com"
                }
            ]
        },
    ]
};

const pricingData = {
    data: [
        {
            planName: "Launch",
            planPrice: "$699",
            planDescp: "Ideal for startups and small businesses taking their first steps online.",
            planIncludes: ["Competitive research & insights","Wireframing and prototyping","Basic tracking setup (Google Analytics, etc.)","Standard contact form integration"]
        },
        {
            planName: "Scale",
            tag: "Most popular",
            planPrice: "$1,699",
            cancelPrice: "$2,199",
            planDescp: "Perfect for growing brands needing more customization and flexibility.",
            planIncludes: ["Everything in the Launch Plan","Custom design for up to 10 pages","Seamless social media integration","SEO enhancements for key pages"]
        },
        {
            planName: "Elevate",
            planPrice: "$3,499",
            planDescp: "Best suited for established businesses wanting a fully tailored experience.",
            planIncludes: ["Everything in the Scale Plan","E-commerce functionality (if needed)","Branded email template design","Priority support for six months after launch"]
        },
    ],
    partnerLogo: [
        { light: "/images/home/pricing/partner-1.svg", dark: "/images/home/pricing/partner-dark-1.svg" },
        { light: "/images/home/pricing/partner-2.svg", dark: "/images/home/pricing/partner-dark-2.svg" },
        { light: "/images/home/pricing/partner-3.svg", dark: "/images/home/pricing/partner-dark-3.svg" },
        { light: "/images/home/pricing/partner-4.svg", dark: "/images/home/pricing/partner-dark-4.svg" },
        { light: "/images/home/pricing/partner-5.svg", dark: "/images/home/pricing/partner-dark-5.svg" },
      ],
};

const faqData = {
    data: [
        {
            faq_que: "What services does Umira Sinergi Global provide?",
            faq_ans: 'Umira Sinergi Global provides integrated design and build services, including architectural design, structural engineering, MEP systems, construction works, renovation, and project management for villas, residential buildings, commercial spaces, and infrastructure projects.'
        },
        {
            faq_que: "Do you handle projects from design to construction?",
            faq_ans: 'Yes. We offer a complete design & build solution, managing the entire process from initial concept and planning to construction and final handover, ensuring efficiency, quality control, and clear coordination.'
        },
        {
            faq_que: "How do you ensure quality and safety during construction?",
            faq_ans: 'Quality and safety are our top priorities. Each project is supervised by experienced engineers and site teams, supported by structured quality control procedures, HSE standards, and regular progress monitoring throughout the construction process.'
        },
        {
            faq_que: "How can I start a project with Umira Sinergi Global?",
            faq_ans: 'You can start by contacting our team through the Contact Us page. Shate your project details, location, and requirements, and our team will arrange a discussion or site visit to provide the most suitable solution.'
        }
    ]
};
const contactData = {
    keypoint:["Always-On Customer Support","Service Across the Globe"],
    managerProfile:{
        image:"/images/avatar/avatar_1.jpg",
        name:"Courtney Henry",
        position:"Onboarding & Success Manager"
    }
}

const aboutusStats = [
    {
        number: 50,
        postfix:"+",
        title: 'Clients',
        descp: "We nurture connections beyond client interests"
    },
    {
        number: 24,
        postfix: " Years",
        title: 'Of Experience',
        descp: "Design, Construction & Infrastucture"
    },
    {
        number: 47256,
        postfix: " m²",
        title: 'Total Building Area',
        descp: "The project consists of a total of 429 villa units and 1 hotel. The combined total land area for the villas and hotel amounts to 47,256.64 m²."
    },
]

const servicesSliderData = [
    "Design", "Build", "MEP","Interior","Architecture","BIM Modeling","Structure"
]



export const GET = async () => {
    return NextResponse.json({
        avatarList,
        statsFactData,
        servicesData,
        testimonialData,
        teamData,
        pricingData,
        faqData,
        contactData,
        aboutusStats,
        servicesSliderData
    });
};