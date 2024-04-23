export type Image = {
  url: string;
  alt?: string;
};
export type Article = {
  title: string;
  subtitle?: string;
  author?: string;
  image?: Image;
  date?: string;
  id: string;
  content: string;
};
export type AppLink = {
  label: string;
  route: string;
  icon?: string;
  isInToolbar?: boolean;
};
