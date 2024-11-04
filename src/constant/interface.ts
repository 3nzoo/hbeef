export interface iCategory {
  id: string;
  name: string;
}

export interface iProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  img_Url: string;
  category_id: string;
  createdAt: string;
}

export interface iCategory {
  id: string;
  name: string;
  createdAt: string;
}

export interface iUser {
  id: string;
  username: string;
  createdAt: string;
  role: string;
  password?: string;
}

export interface iReserver {
  id: string;
  date: string;
  createdAt: string;
  description: string;
}
