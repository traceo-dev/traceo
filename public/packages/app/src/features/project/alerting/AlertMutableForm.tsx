import { BellOutlined } from "@ant-design/icons";
import {
  AlertEnumType,
  LogicOperator,
  IAlertRule,
  IMember,
  IAlert,
  Dictionary
} from "@traceo/types";
import { Card } from "@traceo/ui";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Page } from "../../../core/components/Page";
import { useImmer } from "use-immer";
import { AlertBasicForm } from "./components/AlertBasicForm";
import { AlertNotificationForm } from "./components/AlertNotificationForm";
import { AlertRecipientsForm } from "./components/AlertRecipientsForm";
import { AlertRulesForm } from "./components/AlertRulesForm";
import { AlertTypeForm } from "./components/AlertTypeForm";
import { AlertFormType } from "./utils";
import { notify } from "../../../core/utils/notify";

interface Props {
  headerTitle?: string;
  headerSuffix?: string | JSX.Element;
  defaultValues: Partial<IAlert>;
  //   TODO: add type
  onSubmit: (alert: Dictionary<any>) => void;
}
export const AlertMutableForm = ({
  headerTitle = "Alerting",
  headerSuffix = null,
  defaultValues,
  onSubmit
}: Props) => {
  const { id } = useParams();

  const [alertType, setAlertType] = useState<AlertEnumType>(defaultValues.type);
  const [logicOperator, setLogicOperator] = useState<LogicOperator>(defaultValues.logicOperator);
  const [rules, setRules] = useImmer<IAlertRule[]>(defaultValues.rules);

  // notifications
  const [isInAppNotify, setInAppNotify] = useState<boolean>(defaultValues.inAppNotification);
  const [isEmailNotify, setEmailNotify] = useState<boolean>(defaultValues.emailNotification);

  const [isAllMembers, setAllMembers] = useState<boolean>(defaultValues.recipients.length === 0);
  const [selectedMembers, setSelectedMembers] = useState<IMember[]>(defaultValues.recipients);

  const defaultFormValues = {
    name: defaultValues.name,
    description: defaultValues.description,
    severity: defaultValues.severity,
    minTimeInterval: defaultValues.minTimeInterval
  };

  const onFinish = async (alertProps: AlertFormType) => {
    if (rules.length === 0) {
      notify.error("You have to add at least one rule!");
      return;
    }

    if (!isAllMembers && selectedMembers.length === 0) {
      notify.error(
        "You have to add at least one member or switch 'All members' options for recipient!"
      );
      return;
    }

    const alertPayload = {
      ...alertProps,
      projectId: id,
      type: alertType,
      logicOperator,
      inAppNotification: isInAppNotify,
      emailNotification: isEmailNotify,
      rules,
      recipients: !isAllMembers ? selectedMembers.map((e) => e.id) : []
    };

    onSubmit(alertPayload);
  };

  return (
    <Page
      header={{
        title: headerTitle,
        suffix: headerSuffix,
        description: "Get informed about disturbing behavior as soon as it occurs.",
        icon: <BellOutlined />
      }}
    >
      <Page.Content>
        <Card>
          <AlertTypeForm alertType={alertType} setAlertType={setAlertType} />

          <AlertBasicForm defaultValues={defaultFormValues} onFinish={onFinish} />

          <AlertRulesForm
            rules={rules}
            setRules={setRules}
            logicOperator={logicOperator}
            setLogicOperator={setLogicOperator}
          />

          <AlertNotificationForm
            isEmailNotify={isEmailNotify}
            setEmailNotify={setEmailNotify}
            isInAppNotify={isInAppNotify}
            setInAppNotify={setInAppNotify}
          />
          <AlertRecipientsForm
            isAllMembers={isAllMembers}
            setAllMembers={setAllMembers}
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
          />
        </Card>
      </Page.Content>
    </Page>
  );
};
