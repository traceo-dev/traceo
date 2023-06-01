import { FC } from "react";

export const Descriptions: FC = ({ children }) => {
  return (
    <table className="details-table">
      <tbody>{children}</tbody>
    </table>
  );
};

interface DescriptionRowProps {
  label: string;
  className?: string;
}
export const DescriptionRow: FC<DescriptionRowProps> = ({ label, className, children }) => {
  return (
    <tr className="text-sm">
      <td className="font-normal w-[256px]">
        <span className={className}>{label}</span>
      </td>
      <td className="w-32" />
      <td className="w-[400px]" colSpan={2}>
        <span>{children}</span>
      </td>
    </tr>
  );
};
