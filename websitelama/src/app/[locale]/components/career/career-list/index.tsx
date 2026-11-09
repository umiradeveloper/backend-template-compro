"use client";
import { useParams } from "next/navigation";
import CareerListMarkdown from "./careerlist";
import { useEffect, useState } from "react";

const CareerList = () => {
    const param: any = useParams();
    const [career, setCareer] = useState([]);
    const fetchData = async () => {
        try {
            const res = await fetch('/api/careers-data?locale='+param.locale)
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json();
            // console.log(data)
            setCareer(data)
        } catch (error) {
            console.error('Error fetching services:', error)
        }
    }
    useEffect(() => {
        fetchData();
    },[])
    // const param: any = useParams();
    // const locale = param.locale;
    

    return (
       <CareerListMarkdown Careers={career} />

    );
};

export default CareerList;