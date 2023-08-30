import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Setter, isEmpty } from "@traceo/types";
import { Button, Input, InputSecret, Space } from "@traceo/ui";
import { generateRandomId } from "src/core/utils/random";

type HttpHeader = {
  id?: string;
  key: string;
  value: string;
  disabled?: boolean;
};

interface Props {
  headers: HttpHeader[];
  setHeaders: Setter<HttpHeader[]>;
  isBtns?: boolean;
}

export const HeadersSettings = ({ headers, setHeaders, isBtns = true }: Props) => {
  const hasHeaders = isEmpty(headers);

  const onAddHeader = (e: any) => {
    e.preventDefault();

    const header = {
      id: generateRandomId(),
      key: undefined,
      value: undefined
    };

    setHeaders([...headers, header]);
  };

  const onRemoveHeader = (headerId: string) => {
    const hs = headers.filter((h) => h.id !== headerId);
    setHeaders(hs);
  };

  return (
    <Space direction="vertical">
      {!hasHeaders && (
        <table>
          <tbody>
            <tr>
              <th className="text-start font-normal">Key</th>
              <th className="text-start font-normal ">Value</th>
            </tr>
            {headers.map((header) => (
              <HeaderRow key={header.id} header={header} onRemove={onRemoveHeader} />
            ))}
          </tbody>
        </table>
      )}

      {isBtns && (
        <Button
          className="mt-5"
          size="sm"
          icon={<PlusOutlined />}
          onClick={(e) => onAddHeader(e)}
        >
          Add header
        </Button>
      )}
    </Space>
  );
};

interface HeaderRowProps {
  header: HttpHeader;
  onRemove: (id: string) => void;
}
const HeaderRow = ({ header, onRemove }: HeaderRowProps) => {
  return (
    <tr key={header.id}>
      <td>
        <Input
          disabled={header?.disabled}
          className="w-full"
          defaultValue={header.key}
          onChange={(e) => (header.key = e.currentTarget.value)}
        />
      </td>
      <td>
        <InputSecret
          disabled={header?.disabled}
          defaultValue={header.value}
          onChange={(e) => (header.value = e.currentTarget.value)}
        />
      </td>
      <td hidden={header?.disabled}>
        <CloseOutlined
          className="flex p-1 cursor-pointer hover:text-error"
          onClick={(e) => onRemove(header.id)}
        />
      </td>
    </tr>
  );
};
