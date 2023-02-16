export interface ISession {
    id?: string;
    sessionID: string;
    userID: string;
    userName: string;
    userIP: string;
    expiryAt: number;
    createdAt?: number;
    revokedAt?: number;
}