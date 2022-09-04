import { slugifyForUrl } from "./stringUtils";

export const isSlugCorrect = (name: string) => {
  const paths = window.location.pathname.split("/");
  const slug = slugifyForUrl(name);

  return slug === paths[3];
};
