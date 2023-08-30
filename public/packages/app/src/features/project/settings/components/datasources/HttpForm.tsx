import { Alert, Form, FormItem, Input, InputSecret, Select, Space, Typography } from "@traceo/ui";
import { Fragment, useState } from "react";
import { HeadersSettings } from "src/features/project/settings/components/datasources/HeadersSettings";
import { DsFormProps, HttpHeader, apiTypeOptions, authOptions, initialHeaders } from "./types";
import { clearAuth } from "./utils";
import { KeyValueField } from "../../../../../core/components/KeyValueField";
import { HttpFormType, AUTH_ENUM, API_KEY_ENUM } from "@traceo/types";

export function HttpForm({ onSubmit, defaultValues }: DsFormProps<HttpFormType>) {
  const [headers, setHeaders] = useState<HttpHeader[]>(initialHeaders);
  const [auth, setAuth] = useState<AUTH_ENUM>(AUTH_ENUM.NO_AUTH);
  const [apiKeyType, setApiKeyType] = useState<API_KEY_ENUM>(API_KEY_ENUM.HEADER);

  const onFinish = (params: HttpFormType) => {
    const formPayload = clearAuth(params);
    onSubmit(formPayload);
  };

  return (
    <Form
      defaultValues={
        defaultValues ?? {
          name: "HTTP Request",
          auth: {
            type: AUTH_ENUM.NO_AUTH,
            api: {
              type: API_KEY_ENUM.HEADER
            }
          }
        }
      }
      onSubmit={onFinish}
      id="add-datasource-form"
      className="w-full"
    >
      {({ register, errors, setValue }) => (
        <div className="grid grid-cols-12">
          <div className="col-span-7 flex flex-col">
            <Space direction="vertical" className="py-5">
              <Typography size="xl" className="pb-5">
                HTTP
              </Typography>

              <FormItem tooltip="xxx" label="Name" error={errors.name}>
                <Input
                  {...register("name", {
                    required: true
                  })}
                />
              </FormItem>
              <FormItem tooltip="xxx" label="URL" error={errors.url}>
                <Input
                  placeholder="http://localhost:3000"
                  {...register("url", {
                    required: true
                  })}
                />
              </FormItem>
            </Space>

            <Space direction="vertical" className="py-5">
              <Typography size="xl" className="pb-5">
                Headers
              </Typography>

              <HeadersSettings headers={headers} setHeaders={setHeaders} />
            </Space>

            <Space direction="vertical" className="py-5">
              <Typography size="xl" className="pb-5">
                Auth
              </Typography>

              <FormItem label="Type">
                <Select
                  options={authOptions}
                  defaultValue={auth}
                  onChange={(e) => {
                    setAuth(e?.value);
                    setValue("auth.type", e?.value);
                  }}
                />
              </FormItem>

              {auth === AUTH_ENUM.BASIC_AUTH && (
                <KeyValueField
                  keyLabel="Username"
                  keyElement={
                    <Input
                      {...register("auth.basic.username", {
                        required: auth === AUTH_ENUM.BASIC_AUTH
                      })}
                    />
                  }
                  valueLabel="Password"
                  valueElement={
                    <InputSecret
                      {...register("auth.basic.password", {
                        required: auth === AUTH_ENUM.BASIC_AUTH
                      })}
                    />
                  }
                />
              )}

              {auth === AUTH_ENUM.BEARER_TOKEN && (
                <FormItem label="Token">
                  <InputSecret
                    {...register("auth.bearer", {
                      required: auth === AUTH_ENUM.BEARER_TOKEN
                    })}
                  />
                </FormItem>
              )}

              {auth === AUTH_ENUM.API_KEY && (
                <Fragment>
                  <FormItem label="Add to">
                    <Select
                      options={apiTypeOptions}
                      defaultValue={apiKeyType}
                      onChange={(e) => {
                        setApiKeyType(e?.value);
                        setValue("auth.api.type", e?.value);
                      }}
                    />
                  </FormItem>

                  <KeyValueField
                    keyLabel="Key"
                    keyElement={
                      <Input
                        {...register("auth.api.key", {
                          required: auth === AUTH_ENUM.API_KEY
                        })}
                      />
                    }
                    valueLabel="Value"
                    valueElement={
                      <InputSecret
                        {...register("auth.api.value", {
                          required: auth === AUTH_ENUM.API_KEY
                        })}
                      />
                    }
                  />
                </Fragment>
              )}
            </Space>
          </div>
          <div className="col-span-5 p-5"></div>
        </div>
      )}
    </Form>
  );
}
