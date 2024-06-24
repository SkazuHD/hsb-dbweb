import {JWTPayload} from "jose";

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
  uid: string;
  content: string;
  media?: Image[];
  userUid?: string;
  likes?: number;
  liked: boolean;
};
export type AppLink = {
  label: string;
  route: string;
  icon?: string;
  isInToolbar?: boolean;
  requiresAuth: boolean;
  requiresRole?: UserRole;
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
  date: Date;
  location: string;
  description: string;
  userUid?: string;
  type: EventType;
};

export enum EventType {
  Training = 'Training',
  Tournament = 'Tournament',
  Event = 'Event'
}

export type User = {
  username: string;
  password: string; // hashed
  email: string;
  role: UserRole;
  activated: boolean;
  uid: string;
}

export type registerCredential = {
  username: string;
  email: string;
  password: string;
}


export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserScope {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
}

export enum JWTScope {
  REFRESH = 'refresh',
  ACCESS = 'access',
  ID = 'id',
}

export interface RefreshTokenPayload extends JWTPayload {
  uid: string;
  type: JWTScope.REFRESH;
}


export interface AccessTokenPayload extends JWTPayload {
  uid: string; // User ID
  role: UserRole; // User role
  scope: UserScope[]; // Scopes that the user has access to
  type: JWTScope.ACCESS;
}

export interface IDTokenPayload extends JWTPayload {
  type: JWTScope.ID;
  uid: string; // User ID
  email: string; // User email
  role: UserRole; // User role
  // Add more information about the user as neeeded
}

export type JWTPayloadType = RefreshTokenPayload | AccessTokenPayload | IDTokenPayload;
