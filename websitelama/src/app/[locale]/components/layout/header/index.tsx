

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import MenuList from "./MenuList";
import ThemeToggler from "./ThemeToggle";
// import { usePathname } from "next/navigation";
import { usePathname, Link, useRouter } from "@/navigation";
import { signOut, useSession } from "next-auth/react";
import Logo from "../logo";
import { useParams } from "next/navigation";

const Header = () => {
    const { data: session } = useSession();
    const [user, setUser] = useState<{ user: any } | null>(null);
    const [menuData, setMenuData] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false); // Track closing animation
    const [sticky, setSticky] = useState(false);
    // const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);
    

    const router = useRouter();
    const PathnameUse = usePathname();
    const pathname = PathnameUse.replace(/^\/(en|id)/, "") || "/";
    const param = useParams();
    const locale = param.locale;


    // const switchLocale = (nextLocale: 'id' | 'en') => {
    //     router.replace(pathname, { locale: nextLocale });
    // };


    const handleScroll = () => {
        setSticky(window.scrollY >= 80);
    };


    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };


    }, [pathname]);

    const handleSignOut = () => {
        localStorage.removeItem("user");
        signOut();
        setUser(null);
    };

    // Close menu with animation when clicking outside
    useEffect(() => {
        console.log(pathname)
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsClosing(true); // Start closing animation
                setTimeout(() => {
                    setMenuOpen(false); // Hide menu after animation
                    setIsClosing(false);
                }, 300); // Adjust timing to match animation duration
            }
        };

        const fetchData = async () => {
            try {
                const res = await fetch('/api/layout-data')
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json()
                setMenuData(data?.MenuData)
            } catch (error) {
                console.error('Error fetching services:', error)
            }
        }
        fetchData()

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (

        <header className={`fixed top-0 z-50 w-full border-t-4 border-primary transition-all duration-500 ease-in-out before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-0 before:bg-primary before:transition-all before:duration-500 before:ease-in-out ${sticky ? "before:h-full" : "before:h-0"}`}>
            <div className="container">
                <nav className={`relative flex item-center justify-between ${sticky ? 'py-5' : 'py-7'}`}>
                    <div className='flex items-center'>
                        <Logo sticky={sticky} />
                    </div>
                    <div className="flex items-center gap-7">
                        <div className="flex item-center gap-3">
                            <div className="flex items-center gap-1 border rounded-full p-1 bg-[#000000]">
                                <Link
                                    href={pathname}
                                    locale="id"
                                    replace
                                    className={`px-2 py-1 text-sm rounded-full ${locale === "id"
                                            ? "bg-primary text-black"
                                            : "text-white/60 hover:text-white"
                                        }`}
                                >
                                    ID
                                </Link>

                                <Link
                                    href={pathname}
                                    locale="en"
                                    replace
                                    className={`px-2 py-1 text-sm rounded-full ${locale === "en"
                                            ? "bg-primary text-black"
                                            : "text-white/60 hover:text-white"
                                        }`}
                                >
                                    EN
                                </Link>
                            </div>
                            <ThemeToggler />
                            {user?.user || session?.user ? (
                                <div className="relative group flex items-center justify-center">
                                    <Image
                                        src="/images/avatar/avatar_1.jpg"
                                        alt="Image"
                                        width={35}
                                        height={35}
                                        quality={100}
                                        className="rounded-full cursor-pointer "
                                    />
                                    <p
                                        className="absolute w-fit text-sm font-medium text-center z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 bg-gray text-white py-1 px-2 min-w-28 rounded-full shadow-2xl top-full left-1/2 transform -translate-x-1/2 mt-3"
                                    >
                                        {user?.user || session?.user?.name}
                                    </p>
                                </div>
                            ) : ('')}
                        </div>

                        <div className="relative flex align-middle">
                            {menuOpen === false ?
                                <div className="flex align-middle">
                                    <button onClick={() => setMenuOpen(true)}>
                                        <Image src={sticky ? "/images/Icon/menu-button-sticky.svg" : "/images/Icon/menu-button.svg"} alt="icon" width={45} height={45} className="cursor-pointer" />
                                    </button>
                                </div>
                                :
                                <div
                                    ref={menuRef}
                                    className={`absolute -top-5 right-0 flex flex-col gap-5 min-w-80 sm:min-w-96 bg-white dark:bg-twilliteblack p-6 rounded-3xl shadow-lg transition-all duration-300 ease-in-out z-10 
                                    ${isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                                >
                                    <div className="flex items-center justify-between pb-5 border-b border-secondary/15 dark:border-white/15">
                                        <p className="text-secondary dark:text-white">Menu</p>
                                        <div onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer">
                                            <Image src="/images/Icon/close-icon.svg" alt="icon" width={16} height={16} className="dark:hidden" />
                                            <Image src="/images/Icon/close-icon-dark.svg" alt="icon" width={16} height={16} className="hidden dark:block" />
                                        </div>
                                    </div>
                                    <div>
                                        <ul className="flex flex-col gap-2 pb-4">
                                            {menuData?.map((menuItem: any, index: any) =>
                                                <MenuList key={index} item={menuItem} closeMenu={() => setMenuOpen(false)} />
                                            )}
                                        </ul>


                                    </div>
                                    <div>
                                        <Link href="http://wa.me/6282121245959" className="text-secondary/60 dark:text-white/60 hover:text-secondary dark:hover:text-white">+62 821-2124-5959</Link>
                                        <Link href="mailto:office@umiraglobal.com"><h4>office@umiraglobal.com</h4></Link>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;
