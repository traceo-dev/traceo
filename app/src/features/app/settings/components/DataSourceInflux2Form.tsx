import { Confirm } from "../../../../core/components/Confirm";
import api from "../../../../core/lib/api";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { dispatch } from "../../../../store/store";
import { CONNECTION_STATUS, InfluxDS, TSDB_PROVIDER } from "../../../../types/tsdb";
import { StoreState } from "../../../../types/store";
import { INFLUX2_DOCS } from "../../../../core/utils/constants";
import { useMemberRole } from "../../../../core/hooks/useMemberRole";
import { ApiResponse } from "../../../../types/api";
import { loadApplication } from "../../../../features/app/state/application/actions";
import { Input } from "core/ui-components/Input";
import { InputSecret } from "core/ui-components/Input/InputSecret";
import { Button } from "core/ui-components/Button";
import { Form } from "core/ui-components/Form";
import { FormItem } from "core/ui-components/Form/FormItem";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { Link } from "core/ui-components/Link";
import { Alert } from "core/ui-components/Alert";

export const DataSourceInflux2Form = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDeletLoading, setDeleteLoading] = useState<boolean>(false);
  const { isViewer } = useMemberRole();

  const isDeleteBtn = !!application.connectedTSDB;
  const isFailedConnection =
    application.influxDS?.connStatus === CONNECTION_STATUS.FAILED;

  const defaultValues = useMemo(() => {
    return { ...application?.influxDS };
  }, [application]);

  const update = async (form: InfluxDS) => {
    setLoading(true);
    await api
      .post("/api/datasource/config", {
        appId: application.id,
        provider: TSDB_PROVIDER.INFLUX2,
        ...form
      })
      .finally(() => {
        dispatch(loadApplication());
        setLoading(false);
      });
  };

  const remove = async () => {
    setDeleteLoading(true);
    await api
      .delete<ApiResponse<unknown>>("/api/datasource", {
        id: application.id
      })
      .then((response) => {
        if (response.status === "success") {
          dispatch(loadApplication());
        }
      })
      .finally(() => setDeleteLoading(false));
  };

  return (
    <>
      <Form
        id="inlfux-provider-form"
        disabled={isViewer}
        onSubmit={update}
        defaultValues={defaultValues}
        className="mt-3"
      >
        {({ register, errors }) => (
          <>
            <FormItem error={errors.url} label="URL" disabled={isViewer}>
              <Input
                {...register("url", {
                  required: true,
                  pattern: {
                    value: /^((https|http):\/\/.*):?(\d*)\/?(.*)/,
                    message: "This url is invalid!"
                  }
                })}
                placeholder="http://localhost:8086/"
              />
            </FormItem>
            <FormItem error={errors.token} label="Token" disabled={isViewer}>
              <InputSecret
                {...register("token", {
                  required: true
                })}
              />
            </FormItem>
            <div className="w-full flex flex-row justify-between gap-2">
              <FormItem error={errors.org} label="Organization" disabled={isViewer}>
                <Input
                  {...register("org", {
                    required: true
                  })}
                />
              </FormItem>
              <FormItem error={errors.bucket} label="Bucket name" disabled={isViewer}>
                <Input
                  {...register("bucket", {
                    required: true
                  })}
                />
              </FormItem>
            </div>
          </>
        )}
      </Form>
      {!isViewer && (
        <ButtonContainer justify="start">
          <Button loading={isLoading} type="submit" form="inlfux-provider-form">
            Save & Test
          </Button>
          {isDeleteBtn && (
            <Confirm
              description="Are you sure that you want to remove InfluxDB configuration?"
              onOk={remove}
            >
              <Button loading={isDeletLoading} variant="danger">
                Remove
              </Button>
            </Confirm>
          )}
        </ButtonContainer>
      )}

      <Alert
        showIcon={true}
        type="info"
        className="mt-12"
        message={
          <Link href={INFLUX2_DOCS} target="_blank" className="hover:text-gray-200">
            Official documentation
          </Link>
        }
      />
      {isFailedConnection && (
        <Alert
          className="mt-5"
          showIcon={true}
          type="error"
          message={application.influxDS.connError}
        />
      )}
    </>
  );
};
