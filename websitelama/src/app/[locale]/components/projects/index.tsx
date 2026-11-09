import Link from "next/link";

type Project = {
    title: string;
    slug: string;
    ScopeOfWork: string[];
    industry?: string;
    coverImage: string;
};

type Props = {
    projects: Project[];
    locale: string;
};

const ProjectList = ({ projects, locale }: Props) => {
    return (
        <section className="dark:bg-darkblack py-20 md:py-40">
            <div className="flex flex-col gap-24">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {projects.map((project, index) => {
                            return (
                                <div key={index} className="flex flex-col gap-5">
                                    <Link
                                        href={`/${locale}/projects/${project.slug}`}
                                        className="relative group block"
                                    >
                                        <img
                                            src={project.coverImage}
                                            alt={project.title}
                                            className="w-full"
                                        />
                                        <div className="absolute inset-0 backdrop-blur-xs bg-black/70 
                                        opacity-0 group-hover:opacity-100 
                                        transition-opacity duration-300
                                        flex items-center justify-center">
                                            <svg width="65" height="64" viewBox="0 0 65 64" fill="none">
                                                <rect width="64" height="64" rx="32" fill="#f4eee2" />
                                                <path d="M25.6667 25.3333H39M39 25.3333V38.6666M39 25.3333L25.6667 38.6666"
                                                    stroke="#1F2A2E"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </Link>
                                    <div className="flex flex-col gap-3">
                                        <h3>{project.title}</h3>
                                        <div className="flex gap-3">
                                            {project.ScopeOfWork.map((value, index) => {
                                                return (
                                                    <p key={index} className="text-base hover:bg-primary border border-secondary/12 dark:border-white/12 dark:hover:text-secondary w-fit py-1 px-4 rounded-full">{value}</p>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;