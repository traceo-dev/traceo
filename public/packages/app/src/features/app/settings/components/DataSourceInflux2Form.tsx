import { Confirm } from "../../../../core/components/Confirm";
import api from "../../../../core/lib/api";
import { useState, useMemo } from "react";
import { useAppDispatch } from "../../../../store";
import { ConnectionStatus, InfluxDS, TsdbProvider, ApiResponse } from "@traceo/types";
import { INFLUX2_DOCS } from "../../../../core/utils/constants";
import { useMemberRole } from "../../../../core/hooks/useMemberRole";
import { loadApplication } from "../../state/application/actions";
import {
  Input,
  InputSecret,
  Button,
  Form,
  FormItem,
  ButtonContainer,
  Link,
  Alert
} from "@traceo/ui";
import { useApplication } from "../../../../core/hooks/useApplication";
import { InfluxForm } from "src/core/components/Forms/InfluxForm";

export const DataSourceInflux2Form = () => {
  const dispatch = useAppDispatch();
  const { application } = useApplication();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDeletLoading, setDeleteLoading] = useState<boolean>(false);
  const { isViewer } = useMemberRole();

  const isDeleteBtn = !!application.tsdbProvider;
  const isFailedConnection =
    application.influxConfig?.connStatus === ConnectionStatus.FAILED;

  const defaultValues = useMemo(() => {
    return { ...application?.influxConfig };
  }, [application]);

  const update = async (form: InfluxDS) => {
    setLoading(true);
    await api
      .post("/api/datasource/config", {
        appId: application.id,
        provider: TsdbProvider.INFLUX2,
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
          <InfluxForm errors={errors} register={register} namePrefix={null} />
        )}
      </Form>
      {isFailedConnection && (
        <Alert
          className="mt-5"
          showIcon={true}
          type="error"
          message={application.influxConfig.connError}
        />
      )}
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
    </>
  );
};
