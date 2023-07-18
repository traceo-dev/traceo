export type NavItem = {
    id?: string;
    icon?: JSX.Element;
    label: string;
    subtitle?: string;
    url?: string;
    items?: NavItem[];
};