import { ColumnSection } from "../../../../core/components/ColumnSection";
import { Confirm } from "../../../../core/components/Confirm";
import api from "../../../../core/lib/api";
import dateUtils from "../../../../core/utils/date";
import { useState } from "react";
import { useAppDispatch } from "../../../../store";
import { ApiResponse } from "../../../../types/api";
import { loadApplication } from "../../../app/state/application/actions";
import { InputSecret } from "core/ui-components/Input/InputSecret";
import { InputGroup } from "core/ui-components/Input/InputGroup";
import { Button } from "core/ui-components/Button";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { useApplication } from "core/hooks/useApplication";

export const ApiKeySection = () => {
  const dispatch = useAppDispatch();
  const { application } = useApplication();
  const [loading, setLoading] = useState<boolean>(false);

  const hasApiKey = !!application?.security?.apiKey;

  const handleGenerateApiKey = async () => {
    setLoading(true);
    await api
      .post<ApiResponse<string>>(`/api/application/api-key/generate/${application.id}`)
      .then(() => {
        dispatch(loadApplication());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveApiKey = async () => {
    setLoading(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/application/api-key/remove/${application.id}`)
      .then(() => {
        dispatch(loadApplication());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card title="API Key">
      <ColumnSection subtitle="Thanks to API Key you can fully integrate this app with Traceo SDK. Remember to not store this key in your code, better way is to use him like as environment variable.">
        {hasApiKey ? (
          <>
            <InputGroup>
              <InputSecret
                className="w-full"
                readOnly={true}
                defaultValue={application?.security?.apiKey}
              />
              <Confirm
                auth={true}
                description="Removing your API key will cause that SDK using this token lose access."
                onOk={handleRemoveApiKey}
              >
                <Button variant="danger">Remove</Button>
              </Confirm>
            </InputGroup>
            <Typography size="xs">
              Last generated {dateUtils.fromNow(application?.security?.lastUpdate)} by{" "}
              {application?.security?.generatedBy}
            </Typography>
          </>
        ) : (
          <Button loading={loading} onClick={handleGenerateApiKey}>
            Generate
          </Button>
        )}
      </ColumnSection>
    </Card>
  );
};
