'use client';
// import { usePathname } from 'next/navigation'
import Image from "next/image";

import { Link, usePathname } from '@/navigation';
import { useLocale } from 'next-intl';
import { useParams } from "next/navigation";

const MenuList = ({ item, closeMenu }: { item: any, closeMenu: any }) => {
    const { title, path, newTab } = item;
    const pathname = usePathname();
    const params: any = useParams();

    const isActive = pathname === `/${params.locale}${path}`;
    

    return (
        <li className="group flex items-center gap-3 transition-all duration-500 ease-in-out">
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out 
                ${isActive ? "max-w-6 opacity-100" : "max-w-0 opacity-0"} 
                group-hover:max-w-6 group-hover:opacity-100`}
            >
                <Image
                    src="/images/Icon/umiralogosq.png"
                    alt="icon"
                    height={20}
                    width={20}
                    className="animate-spin dark:hidden"
                />
                <Image
                    src="/images/Icon/umiralogosq.png"
                    alt="icon"
                    height={20}
                    width={20}
                    className="animate-spin hidden dark:block"
                />
            </div>
            <Link href={path} onClick={closeMenu} className="text-secondary dark:text-white text-2xl font-bold" target={newTab ? "_blank" : "_self"} locale={params.locale} >
                {title}
            </Link>
        </li>
    );
};

export default MenuList;
