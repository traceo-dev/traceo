import { DatabaseOutlined } from "@ant-design/icons";
import { AUTH_ENUM, DATASOURCE_PROVIDER } from "@traceo/types";
import { SelectOptionProps } from "@traceo/ui";
import { generateRandomId } from "src/core/utils/random";

export interface DsFormProps<T> {
  defaultValues?: T;
  onSubmit: (form: T) => void;
}

export const selectOptions: SelectOptionProps[] = [
  {
    icon: <DatabaseOutlined />,
    label: "HTTP Request",
    value: DATASOURCE_PROVIDER.HTTP,
    description: "Connect your own or external endpoint to check any data."
  }
  // {
  //   icon: <DatabaseOutlined />,
  //   label: "MongoDB",
  //   value: DATASOURCE_PROVIDER.MONGODB,
  //   description: "lorem ipsum dolor sit ames"
  // },
  // {
  //   icon: <DatabaseOutlined />,
  //   label: "PostgreSQL",
  //   value: DATASOURCE_PROVIDER.POSTGRESQL,
  //   description: "lorem ipsum dolor sit ames"
  // },
  // {
  //   icon: <DatabaseOutlined />,
  //   label: "MySQL",
  //   value: DATASOURCE_PROVIDER.MYSQL,
  //   description: "lorem ipsum dolor sit ames"
  // },
  // {
  //   icon: <DatabaseOutlined />,
  //   label: "ClickhouseDB",
  //   value: DATASOURCE_PROVIDER.CLICKHOUSE,
  //   description: "lorem ipsum dolor sit ames"
  // }
];

export type HttpHeader = {
  id?: string;
  key: string;
  value: string;
  disabled?: boolean;
};

export const initialHeaders: HttpHeader[] = [
  {
    id: generateRandomId(),
    key: "Content-Type",
    value: "application/json",
    disabled: true
  },
  {
    id: generateRandomId(),
    key: "Transfer-Encoding",
    value: "chunked",
    disabled: true
  }
];

export const authOptions: SelectOptionProps[] = [
  {
    label: "No auth",
    value: AUTH_ENUM.NO_AUTH
  },
  {
    label: "Bearer Token",
    value: AUTH_ENUM.BEARER_TOKEN
  },
  {
    label: "Api Key",
    value: AUTH_ENUM.API_KEY
  },
  {
    label: "Basic Auth",
    value: AUTH_ENUM.BASIC_AUTH
  }
];

export const apiTypeOptions: SelectOptionProps[] = [
  {
    label: "Headers",
    value: "header"
  },
  {
    label: "Params",
    value: "param"
  }
];
