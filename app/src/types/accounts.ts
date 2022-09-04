import { MEMBER_STATUS } from "./application";

export interface Account {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  logo: string;
  createdAt: number;
  status?: MEMBER_STATUS;
  about?: string;
}
