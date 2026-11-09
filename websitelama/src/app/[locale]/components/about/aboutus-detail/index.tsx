"use client";

import { useTranslations } from "next-intl";

const AboutusDetail = () => {
    const t = useTranslations("AboutDetail")
    return (
        <section className="py-10 md:py-20 xl:py-40 dark:bg-secondary">
            <div className='container'>
                <div className='flex flex-col xl:flex-row gap-8'>
                    <div className='max-w-xl w-full'>
                        <h2 className='text-56'>Umira Sinergi Global</h2>
                    </div>
                    <div className='flex flex-col gap-12'>
                        <p className="text-secondary dark:text-white"> <strong className="block mb-2">{t("visionTitle")}</strong>{t("visionText")}</p>
                        <div className='text-secondary dark:text-white'>
                            <strong className="block mb-2">{t("missionTitle")}</strong>
                            <ul className="list-disc list-outside pl-6 space-y-3">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <li key={i}>{t(`mission.${i}`)}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-secondary dark:text-white">
                            <strong className="block mb-2">{t("valueTitle")}</strong>

                            <ul className="list-disc list-outside pl-6 space-y-3">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <li key={i}>{t(`values.${i}`)}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutusDetail