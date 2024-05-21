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
  media?: Image[];
  userUid?: string;
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
  schedule?: { time: string, age: string }[];
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
  telephone: string;
  fax: string;
  mobile: string;
  name: string;
};

export type Event = {
  uid: string;
  title: string;
  dateTime: Date;
  location: string;
  description: string;
  userUid?: string;
  type: "Training" | "Tournament" | "Event";
};

export type User = {
  username: string;
  password: string; // hashed
  email: string;
  role: "admin" | "user";
  activated: boolean;
  uid: string;
}

export type registerCredential = {
  username: string;
  email: string;
  password: string;
}