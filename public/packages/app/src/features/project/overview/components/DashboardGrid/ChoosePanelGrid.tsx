import { SelectOptionProps, Typography, conditionClass, joinClasses } from "@traceo/ui";

interface Props {
  options: SelectOptionProps[];
  onSelect: (val: any) => void;
  selected: any;
}
export const ChoosePanelGrid = ({ onSelect, options, selected }: Props) => {
  return (
    <div className="grid grid-cols-8 gap-x-3">
      {options.map(({ icon, label, value }, index) => (
        <div className="flex flex-col" key={index}>
          <div
            onClick={() => onSelect(value)}
            key={index}
            className={joinClasses(
              "col-span-1 w-full flex flex-col items-center rounded cursor-pointer p-5 bg-secondary border rounded border-light-secondary border-solid",
              conditionClass(selected === value, "ring-2 ring-blue-400")
            )}
          >
            <span className="text-xl text-yellow-500">{icon}</span>
          </div>
          <Typography className="pt-5 text-center">{label}</Typography>
        </div>
      ))}
    </div>
  );
};
