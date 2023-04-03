interface Props {
  href: string;
  icon: JSX.Element;
  target?: string;
}
export const HrefIcon = ({ href, target = "_blank", icon }: Props) => {
  return (
    <a target={target} href={href} className="text-primary hover:text-white cursor-pointer">
      {icon}
    </a>
  );
};
