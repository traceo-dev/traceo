import { DATASOURCE_PROVIDER } from "@traceo/types";
import { Button, ButtonContainer, Space, Modal, Select, FormItem } from "@traceo/ui";
import { useState } from "react";
import { HttpForm } from "./datasources/HttpForm";
import { selectOptions } from "./datasources/types";

export const AddDatasourceModal = ({ isOpen, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<DATASOURCE_PROVIDER>(DATASOURCE_PROVIDER.HTTP);

  const onClose = () => {
    onCancel();
  };

  const onFinish = async (form: any) => {
    console.log(form);
  };

  const renderContent = () => {
    switch (provider) {
      case DATASOURCE_PROVIDER.HTTP:
        return <HttpForm onSubmit={onFinish} />;
      case DATASOURCE_PROVIDER.MONGODB:
      case DATASOURCE_PROVIDER.POSTGRESQL:
      case DATASOURCE_PROVIDER.MYSQL:
      case DATASOURCE_PROVIDER.CLICKHOUSE:
        return null;
    }
  };

  return (
    <Modal title="Add datasource" size="xl" onCancel={onClose} open={isOpen}>
      <Space direction="vertical" className="w-full">
        <FormItem label="Select provider">
          <Select
            value={provider}
            options={selectOptions}
            onChange={(opt) => setProvider(opt?.value)}
          />
        </FormItem>

        {renderContent()}

        <ButtonContainer justify="start" className="pt-5">
          <Button loading={loading} type="submit" form="add-datasource-form">
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ButtonContainer>
      </Space>
    </Modal>
  );
};
