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
export type AppLink = {
  label: string;
  route: string;
  icon?: string;
  isInToolbar?: boolean;
};
