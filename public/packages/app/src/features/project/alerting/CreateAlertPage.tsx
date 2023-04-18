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
  Form,
  FormItem,
  Input,
  InputArea,
  RadioButton,
  Select,
  SelectOptionProps,
  Switch,
  Typography
} from "@traceo/ui";
import { useNavigate, useParams } from "react-router-dom";
import { ChooseElementGrid } from "src/core/components/ChooseElementGrid";
import { Page } from "src/core/components/Page";
import { useState } from "react";
import { IncidentTriggerBuilder } from "./rules/IncidentTriggerBuilder";
import { AlertEnumType, AlertRule, LogicOperator } from "./rules/utils";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import { AlertSeverity, ApiResponse, IAlert, ProjectMember } from "@traceo/types";
import { AlertRecipients } from "./AlertRecipients";
import api from "src/core/lib/api";

type AlertType = {
  name: string;
  description: string;
  severity: AlertSeverity;
};

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

const CreateAlertPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [alertType, setAlertType] = useState<AlertEnumType>(AlertEnumType.INCIDENT);
  const [logicOperator, setLogicOperator] = useState<LogicOperator>(LogicOperator.ANY);
  const [rules, setRules] = useState<AlertRule[]>([]);

  // notifications
  const [isInAppNotify, setInAppNotify] = useState<boolean>(true);
  const [isEmailNotify, setEmailNotify] = useState<boolean>(false);

  const [isAllMembers, setAllMembers] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<ProjectMember[]>([]);

  const onFinish = async (alertProps: AlertType) => {
    const alertPayload = {
      type: alertType,
      name: alertProps.name,
      description: alertProps.description,
      severity: alertProps.severity,
      logicOperator,
      inAppNotification: isInAppNotify,
      emailNotification: isEmailNotify,
      rules,
      recipients: selectedMembers.map((e) => e.id)
    };

    const resp: ApiResponse<unknown> = await api.post("/api/alert", alertPayload);
    console.log("resp: ", resp);
  };

  const onAddRule = () => setRules([...rules, { uuid: uuid() }]);
  const onRemoveRule = (rule: AlertRule) =>
    setRules(rules.filter(({ uuid }) => uuid !== rule.uuid));

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
            <Button type="submit" form="add-alert-form" variant="primary">
              Save
            </Button>
          </div>
        )
      }}
    >
      <Page.Content>
        <Card>
          <Section>
            <SectionHeader
              index={1}
              title="Choose alert type"
              description="The creation of conditions to trigger alerts depends on the selected alert type. Choose the one that suits your needs."
            />
            <SectionContent>
              <ChooseElementGrid
                options={alertOptions}
                onSelect={setAlertType}
                selected={alertType}
              />
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader
              index={2}
              title="Provide basic informations"
              description="Provide basic information about the alert you are creating. This data will be used, for example, to inform about the occurrence of this alert in e-mails."
            />
            <SectionContent>
              <Form onSubmit={onFinish} id="add-alert-form">
                {({ register, errors, setValue }) => (
                  <>
                    <FormItem showRequiredMark={true} label="Severity" error={errors.name}>
                      <Select
                        {...register("severity", {
                          required: true
                        })}
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
                  </>
                )}
              </Form>
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader
              index={3}
              title="Rules"
              description="Create a rules to tell us when this alert should be triggered"
            />
            <SectionContent>
              <IncidentTriggerBuilder
                rules={rules}
                onAddRule={onAddRule}
                onRemove={onRemoveRule}
                setLogicOperator={setLogicOperator}
              />
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader
              index={4}
              title="Notifications"
              description="Select a notification type and assign users who should be notified when this alert occurs."
            />
            <SectionContent>
              <NotificationSwitchWrapper>
                <div className="flex flex-col">
                  <Typography size="md" weight="semibold">
                    In-app
                  </Typography>
                  <Typography size="xs">
                    Delivery of internal notifications in the Traceo application.
                  </Typography>
                </div>
                <Switch
                  value={isInAppNotify}
                  onChange={(e) => setInAppNotify(e.target["checked"])}
                />
              </NotificationSwitchWrapper>
              <NotificationSwitchWrapper>
                <div className="flex flex-col">
                  <Typography size="md" weight="semibold">
                    Email notifications
                  </Typography>
                  <Typography size="xs">
                    An emails will be sent containing the information about this alert provided in
                    the basic informations section.
                  </Typography>
                </div>
                <Switch
                  value={isEmailNotify}
                  onChange={(e) => setEmailNotify(e.target["checked"])}
                />
              </NotificationSwitchWrapper>
            </SectionContent>
          </Section>
          <Section>
            <SectionHeader
              index={5}
              title="Alert recipients"
              description="Choose who should receive alert notifications or check the box below to select
              all members of this app."
            />
            <SectionContent>
              <NotificationSwitchWrapper>
                <div className="flex flex-col">
                  <Typography size="md" weight="semibold">
                    All members
                  </Typography>
                  <Typography size="xs">
                    Send an alert notification to all members of this project.
                  </Typography>
                </div>
                <Switch
                  value={isAllMembers}
                  onChange={(e) => setAllMembers(e.target["checked"])}
                />
              </NotificationSwitchWrapper>
              {!isAllMembers && (
                <AlertRecipients
                  selectedMembers={selectedMembers}
                  setSelectedMembers={setSelectedMembers}
                />
              )}
            </SectionContent>
          </Section>
        </Card>
      </Page.Content>
    </Page>
  );
};

export default CreateAlertPage;

const Section = styled.div`
  width: 100%;
  padding-bottom: 65px;
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary);
`;

const SectionContent = styled.div`
  padding-inline: 25px;
`;

const SectionHeader = ({ title, description = null, index }) => {
  return (
    <div className="flex flex-row text-primary mb-5">
      <span className="text-xl font-semibold">{index}.</span>
      <div className="flex flex-col pl-3">
        <span className="font-semibold text-xl text-primary">{title}</span>
        {description && <span className="text-md text-primary">{description}</span>}
      </div>
    </div>
  );
};

const NotificationSwitchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 15px;
  justify-content: space-between;
  width: 100%;
`;

export const RowContainer = styled.div`
  width: 100%;
  justify-content: space-between;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: row;
  gap-row: 12px;
  border: 1px solid var(--color-bg-light-secondary);
  border-radius: 6px;
  padding: 6px;
  padding-inline: 12px;
  align-items: center;
  margin-bottom: 9px;
`;
