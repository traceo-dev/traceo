import { Account } from "./accounts";

export interface Comment {
  id: string;
  message: string;
  createdAt: number;
  removed: boolean;
  lastUpdateAt: number;
  sender: Pick<Account, "id" | "name" | "email" | "gravatar">
}
