import { AppstoreFilled } from "@ant-design/icons";
import { Row } from "@traceo/ui";

type PopoverSelectOptionsProps = {
  label: string;
  icon?: JSX.Element;
  onClick?: () => void;
};

interface Props {
  title: string;
  options: PopoverSelectOptionsProps[];
}
export const PopoverSelectOptions = ({ options, title }: Props) => {
  return (
    <div className="min-w-[180px] flex flex-col font-normal bg-canvas">
      <span className="text-2xs text-primary font-semibold p-3 uppercase">{title}</span>
      {options.map((option, key) => (
        <span
          key={key}
          onClick={() => option?.onClick && option?.onClick()}
          className="text-sm p-2 hover:bg-secondary cursor-pointer text-primary"
        >
          <Row gap="x-3">
            {option.icon}
            {option.label}
          </Row>
        </span>
      ))}
    </div>
  );
};
