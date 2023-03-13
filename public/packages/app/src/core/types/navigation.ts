export type RouteComponent<T = any> = React.ComponentType<T>;

export interface RouteDescriptor {
  path: string;
  component: RouteComponent<any>;
  wrapper?: RouteComponent<any>;
  roles?: () => string[];
}

export interface MenuRoute {
  label?: string;
  key?: string;
  href?: string;
  private?: boolean;
  disabled?: boolean;
  icon?: JSX.Element;
  adminRoute?: boolean;
  onClick?: () => void;
  routes?: MenuRoute[];
  badge?: JSX.Element;
}
