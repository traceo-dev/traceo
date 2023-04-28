import { AlertStatus } from "@traceo/types";
import { useAppDispatch } from "../../../store/index";
import {
  FormItem,
  Button,
  ButtonContainer,
  Space,
  Modal,
  Alert,
  DateTimePicker
} from "@traceo/ui";
import dayjs from "dayjs";
import { useState } from "react";
import { loadAlert } from "../../../features/project/alerting/state/actions";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import api from "../../../core/lib/api";

const MIN_DATE = new Date(dayjs().unix() * 1e3);
const DEFAULT_DATE = dayjs().add(1, "d").unix();
export const MuteAlertModal = ({ isOpen, onCancel }) => {
  const dispatch = useAppDispatch();

  const { alert } = useSelector((state: StoreState) => state.alert);

  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<number>(DEFAULT_DATE);

  const onFinish = async () => {
    setLoading(true);

    await api
      .patch(`/api/alert/${alert.id}`, {
        ...alert,
        status: AlertStatus.MUTED,
        mutedEndAt: date,
        recipients: alert.recipients.map((e) => e.id)
      })
      .then(() => {
        dispatch(loadAlert(alert.id));
      })
      .finally(() => {
        setLoading(false);
        onCancel();
      });
  };

  return (
    <Modal title="Mute the alert" onCancel={onCancel} open={isOpen}>
      <Space direction="vertical" className="w-full">
        <Alert
          type="info"
          message="Set the date when the alert should return to the active state"
        />
        <form className="pt-5" id="mute-form" onSubmit={onFinish}>
          <FormItem label="Date">
            <DateTimePicker value={date} submit={(e) => setDate(e)} minDate={MIN_DATE} />
          </FormItem>
        </form>

        <ButtonContainer className="float-left">
          <Button loading={loading} type="submit" form="mute-form">
            OK
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </ButtonContainer>
      </Space>
    </Modal>
  );
};
