import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "markdown/career");

export function getCareerSlugs(locale: string = "en") {
  const localeDir = join(postsDirectory, locale);
  return fs.readdirSync(localeDir);
}

export function getCareerBySlug(slug: string, fields: string[] = [], locale: string = "en") {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = join(postsDirectory, locale, `${realSlug}.mdx`);

  // Fallback to English if locale file doesn't exist
  const fallbackPath = join(postsDirectory, "en", `${realSlug}.mdx`);
  const filePath = fs.existsSync(fullPath) ? fullPath : fallbackPath;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const items: any = {};

  function processImages(content: string) {
    return content.replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" alt="" />');
  }

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = processImages(content);
    }
    if (field === "metadata") {
      items[field] = { ...data, coverImage: data.coverImage || null };
    }
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllCareer(fields: string[] = [], locale: string = "en") {
  const slugs = getCareerSlugs(locale);
  const careers = slugs.map((slug) => getCareerBySlug(slug, fields, locale));
  return careers;
}
