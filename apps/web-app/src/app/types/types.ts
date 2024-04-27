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
  requiresAuth: boolean;
};

export type InfoText = {
  title: string;
  content: string;
  schedule?: {time:string, age:string}[]; 
  schedule_title?: string;
  schedule_days?: string;
};

