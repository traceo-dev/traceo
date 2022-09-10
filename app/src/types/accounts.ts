export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISABLED = "disabled"
}

export interface Account {
  id: string;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  status: AccountStatus;
  active: boolean;
  createdAt: number;
  about: string;
  isPasswordUpdated: boolean;
  gravatar: string;
}

export interface AddAccountProps {
  email: string;
  name: string;
  username: string;
  password: string;
}