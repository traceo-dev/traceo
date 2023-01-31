export interface ISession {
    id?: string;
    sessionID: string;
    accountID: string;
    accountName: string;
    accountIP: string;
    expiryAt: number;
    createdAt?: number;
    revokedAt?: number;
}