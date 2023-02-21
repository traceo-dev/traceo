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
    <tr>
      <td className="details-table-label">
        <span className={className}>{label}</span>
      </td>
      <td className="w-32" />
      <td className="details-table-value" colSpan={2}>
        <span>{children}</span>
      </td>
    </tr>
  );
};
