import { SelectOptionProps } from "@traceo/ui";
import { joinClasses, conditionClass } from "../utils/classes";

interface Props {
  options: SelectOptionProps[];
  onSelect: (val: any) => void;
  selected: any;
}
export const ChooseElementGrid = ({ onSelect, options, selected }: Props) => {
  return (
    <div className="grid grid-cols-8 py-9 gap-x-3">
      {options.map(({ icon, label, value }, index) => (
        <div
          onClick={() => onSelect(value)}
          key={index}
          className={joinClasses(
            "col-span-1 w-full flex flex-col items-center rounded cursor-pointer p-5 hover:bg-secondary border rounded border-light-secondary border-solid",
            conditionClass(selected === value, "ring-2 ring-blue-400")
          )}
        >
          {icon}
          <span className="pt-5 text-center">{label}</span>
        </div>
      ))}
    </div>
  );
};
