export interface Comment {
  id: string;
  message: string;
  createdAt: number;
  removed: boolean;
  lastUpdateAt: number;
  sender: {
    id: string;
    name: string;
    email: string;
    logo: string;
  };
}
