import { AlertSeverity, Setter } from "@traceo/types";
import { Form, FormItem, Select, InputArea, Input } from "@traceo/ui";
import { Section, SectionHeader, SectionContent } from "../utils";
import { Fragment } from "react";

type AlertFormType = {
  name: string;
  description: string;
  severity: AlertSeverity;
  minTimeInterval: number;
};

interface Props {
  onFinish: Setter<AlertFormType>;
  defaultValues?: Partial<AlertFormType>;
}

export const AlertBasicForm = ({ onFinish, defaultValues }: Props) => {
  return (
    <Section>
      <SectionHeader
        index={2}
        title="Provide basic informations"
        description="Provide basic information about the alert you are creating. This data will be used, for example, to inform about the occurrence of this alert in e-mails."
      />
      <SectionContent>
        <Form defaultValues={defaultValues} onSubmit={onFinish} id="alert-form">
          {({ register, errors, setValue }) => (
            <Fragment>
              <FormItem showRequiredMark={true} label="Severity" error={errors.name}>
                <Select
                  {...register("severity", {
                    required: true
                  })}
                  defaultValue={defaultValues?.severity}
                  onChange={(e) => setValue("severity", e?.value)}
                  placeholder="Select severity for this alert"
                  options={Object.values(AlertSeverity).map((severity) => ({
                    label: severity,
                    value: severity
                  }))}
                />
              </FormItem>
              <FormItem showRequiredMark={true} label="Name" error={errors.name}>
                <Input
                  {...register("name", {
                    required: true
                  })}
                />
              </FormItem>
              <FormItem label="Description" error={errors.description}>
                <InputArea {...register("description")} />
              </FormItem>
              <FormItem
                className="w-1/4"
                label="Min. time interval"
                error={errors.minTimeInterval}
                tooltip="The minimum time interval to receive the next alert of the same type. Value passed in minutes."
              >
                <Input
                  min={1}
                  type="number"
                  {...register("minTimeInterval", {
                    required: true
                  })}
                />
              </FormItem>
            </Fragment>
          )}
        </Form>
      </SectionContent>
    </Section>
  );
};
