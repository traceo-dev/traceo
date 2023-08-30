interface ColumnValueProps {
  keyElement: JSX.Element | string | number;
  valueElement: JSX.Element | string | number;
  keyLabel?: string;
  valueLabel?: string;
}

export const KeyValueField = ({
  keyElement,
  valueElement,
  keyLabel = undefined,
  valueLabel = undefined
}: ColumnValueProps) => {
  return (
    <table>
      <tbody>
        <tr>
          <th className="text-start font-semibold">{keyLabel}</th>
          <th className="text-start font-semibold ">{valueLabel}</th>
        </tr>
        <tr>
          <td>{keyElement}</td>
          <td>{valueElement}</td>
        </tr>
      </tbody>
    </table>
  );
};
