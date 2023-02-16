export type NotifyType = "success" | "warning" | "error" | "info";
export type NotifyItem = {
    id?: string;
    title: string;
    description?: string;
    type: NotifyType;
}
