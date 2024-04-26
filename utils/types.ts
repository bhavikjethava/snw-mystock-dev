export interface ProjectProps {
  id?: number;
  name: string;
}

export interface UserProps {
  id?: number;
  name?: string;
  email?: string;
  projects?: ProjectProps[];
  is_admin?: boolean;
}

export interface FormData {
  [Key: string]: string | null | undefined;
}

export interface StocksProps {
  id?: number;
  symbol?: string;
  user_id?: string;
  name?: string;
  open?: number;
  close?: number;
  volume?: number;
}
