import { RouteProps } from "react-router-dom";

export type UrlQueryValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | undefined
  | null;

export type UrlQueryMap = Record<string, UrlQueryValue>;

export type RouteComponent<T = any> = React.ComponentType<T>;

export interface RouteDescriptor {
  path: string;
  component: RouteComponent<any>;
  wrapper?: RouteComponent<any>;
  roles?: () => string[];
  pageClass?: string;
  routeName?: string;
  exact?: boolean;
}

export interface MenuRoute {
  label: string;
  key: string;
  href?: string;
  private?: boolean;
  disabled?: boolean;
  icon?: JSX.Element;
  adminRoute?: boolean;
}
