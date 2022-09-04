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

// eslint-disable-next-line
export interface KlepperRouteComponentProps<Q = UrlQueryMap> extends RouteProps {
  route: RouteDescriptor;
  queryParams: Q;
}

export type KlepperRouteComponent<T = any> = React.ComponentType<T>;

export interface RouteDescriptor {
  path: string;
  component: KlepperRouteComponent<any>;
  wrapper?: KlepperRouteComponent<any>;
  roles?: () => string[];
  pageClass?: string;
  routeName?: string;
  exact?: boolean;
}

export interface NavRoute {
  icon?: JSX.Element;
  label: string;
  href?: string;
  key?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: NavRoute[];
}

export interface MenuRoute {
  label: string;
  key: string;
  href?: string;
  private?: boolean;
  disabled?: boolean;
  icon?: JSX.Element;
}
