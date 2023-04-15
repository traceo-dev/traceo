import {
  AlertOutlined,
  AlignLeftOutlined,
  BarChartOutlined,
  BellOutlined,
  RocketOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  FormItem,
  Input,
  InputArea,
  RadioButton,
  Select,
  SelectOptionProps,
  Typography
} from "@traceo/ui";
import { useNavigate, useParams } from "react-router-dom";
import { ChooseElementGrid } from "src/core/components/ChooseElementGrid";
import { Page } from "src/core/components/Page";
import { useState } from "react";
import { IncidentTriggerBuilder } from "./trigger-builders/IncidentTriggerBuilder";

type AlertType = {
  name: string;
  description: string;
  severity: string;
};

export enum AlertEnumType {
  INCIDENT = "incident",
  PERFORMANCE = "performance",
  METRIC = "metric",
  LOGS = "logs"
}

enum IncidentTriggerCondition {
  CONDITION_1 = "",
  CONDITION_2 = "",
  CONDITION_3 = "",
  CONDITION_4 = "",
  CONDITION_5 = "",
  CONDITION_6 = "",
  CONDITION_7 = "",
  CONDITION_8 = ""
}

const triggerOptions: SelectOptionProps[] = [
  {
    label: "WHEN NEW INCIDENT OCCUR",
    value: ""
  },
  {
    label: "WHEN NEW INCIDENT OCCUR WHERE NAME = $1",
    value: ""
  },
  {
    label: "WHEN NEW INCIDENT OCCUR WHERE NAME = $1 OR type = $2",
    value: ""
  },
  {
    label: "WHEN NEW INCIDENT OCCUR WHERE NAME LIKE $1",
    value: ""
  },
  {
    label: "WHEN NEW INCIDENT OCCUR WHERE NAME STARTSWITH $1",
    value: ""
  },
  {
    label: "WHEN NEW EVENT OCCUR FOR INCIDENT = $1",
    value: ""
  },
  {
    label: "WHEN NEW EVENT OCCUR FOR INCIDENT = $1 $2 THAN $3 TIMES",
    value: ""
  },
  {
    label: "WHEN NEW EVENT OCCUR FOR INCIDENT = $1 MORE THAN $2 TIMES IN LAST $3 $4",
    value: ""
  }
];

const alertOptions: SelectOptionProps[] = [
  {
    label: "Incidents",
    value: AlertEnumType.INCIDENT,
    icon: <AlertOutlined className="text-3xl text-yellow-500" />
  },
  {
    label: "Web performance",
    value: AlertEnumType.PERFORMANCE,
    icon: <RocketOutlined className="text-3xl text-yellow-500" />
  },
  {
    label: "Metrics",
    value: AlertEnumType.METRIC,
    icon: <BarChartOutlined className="text-3xl text-yellow-500" />
  },
  {
    label: "Logs",
    value: AlertEnumType.LOGS,
    icon: <AlignLeftOutlined className="text-3xl text-yellow-500" />
  }
];

enum AlertSeverity {
  INFO = "info",
  WARNING = "warning",
  CRITICAl = "critical"
}

const CreateAlertPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [alertType, setAlertType] = useState<AlertEnumType>(AlertEnumType.INCIDENT);

  const onFinish = (alertProps: AlertType) => {
    console.log("props: ", alertProps);
  };

  return (
    <Page
      header={{
        title: "Alerting / Create",
        description: "Get informed about disturbing behavior as soon as it occurs.",
        icon: <BellOutlined />,
        suffix: (
          <div className="flex flex-row gap-x-3">
            <Button variant="danger" onClick={() => navigate(`/project/${id}/alerting`)}>
              Cancel
            </Button>
            <Button variant="primary">Save</Button>
          </div>
        )
      }}
    >
      <Page.Content>
        <Card>
          <div className="flex flex-col mb-9">
            <span className="font-semibold text-xl text-primary">1. Choose alert type</span>
            <ChooseElementGrid
              options={alertOptions}
              onSelect={setAlertType}
              selected={alertType}
            />
          </div>

          <div className="flex flex-col mb-9">
            <span className="font-semibold text-xl pb-9 text-primary">
              2. Provide basic informations
            </span>
            <Form onSubmit={onFinish} id="add-alert-form">
              {({ register, errors }) => (
                <>
                  <FormItem showRequiredMark={true} label="Severity" error={errors.name}>
                    {/* <Input
                      {...register("severity", {
                        required: true
                      })}
                    /> */}

                    <Select
                      {...register("severity", {
                        required: true
                      })}
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
                  <FormItem
                    showRequiredMark={true}
                    className="pt-5"
                    label="Description"
                    error={errors.description}
                  >
                    <InputArea
                      {...register("description", {
                        required: true
                      })}
                    />
                  </FormItem>
                </>
              )}
            </Form>
          </div>

          <div className="flex flex-col mb-12">
            <div className="flex flex-row pb-12">
              <span className="text-xl">3.</span>
              <div className="flex flex-col pl-3">
                <span className="font-semibold text-xl text-primary">Trigger condition</span>
                <span className="text-md text-primary">
                  Create a condition to tell us when this alert should be triggered
                </span>
              </div>
            </div>

            <IncidentTriggerBuilder />
          </div>

          <div className="flex flex-col mb-9">
            <span className="font-semibold text-xl text-primary">4. Notifications</span>
          </div>
        </Card>
      </Page.Content>
    </Page>
  );
};

export default CreateAlertPage;
