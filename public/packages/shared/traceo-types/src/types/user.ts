export type AddUserProps = Pick<IUser, "email" | "name" | "username"> & { password: string };

export enum UserRole {
  ADMIN = "admin",
  GUEST = "guest"
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISABLED = "disabled"
}

export interface IUser {
  id?: string;

  name: string;
  username: string;
  email: string;

  password: string;
  isPasswordUpdated: boolean;

  status: UserStatus;
  admin: boolean;

  gravatar: string;

  lastActiveAt?: number;
  createdAt?: number;

  // defaultOrganizationId: string;

  // organizations: IMember[];
}
