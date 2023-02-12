import { useMemo } from "react";
import { IDatasource } from "@traceo/types";
import { useMemberRole } from "../../../../core/hooks/useMemberRole";
import { Form } from "@traceo/ui";
import { useApplication } from "../../../../core/hooks/useApplication";
import { InfluxForm } from "src/core/components/Forms/InfluxForm";

interface Props {
  datasource: IDatasource;
  //TODO: add types
  save: (form: any) => void;
}
export const DataSourceInflux2Form = (props: Props) => {
  const { datasource, save } = props;

  const { application } = useApplication();
  const { isViewer } = useMemberRole();

  const defaultValues = useMemo(() => {
    return {
      url: datasource?.url,
      tsdbConfiguration: datasource?.details
    };
  }, [application]);

  return (
    <Form
      id="inlfux-provider-form"
      disabled={isViewer}
      onSubmit={save}
      defaultValues={defaultValues}
      className="mt-3"
    >
      {({ register, errors }) => <InfluxForm errors={errors} register={register} />}
    </Form>
  );
};
