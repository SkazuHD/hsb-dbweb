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

export type Contact = {
  additionalDescription: string;
  location: string;
  street: string;
  titleMap: string;
  titleLocation: string;
  titleContact: string;
  content: string;
  email: string;
  telephoneNumbers: string;
  telephone: string;
  faxNumbers: string;
  fax: string;
  mobilNumbers: string;
  mobil: string;
  name: string;
};
