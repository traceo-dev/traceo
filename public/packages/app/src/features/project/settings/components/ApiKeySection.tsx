import { ColumnSection } from "../../../../core/components/ColumnSection";
import { Confirm } from "../../../../core/components/Confirm";
import { useProject } from "../../../../core/hooks/useProject";
import api from "../../../../core/lib/api";
import dateUtils from "../../../../core/utils/date";
import { useAppDispatch } from "../../../../store";
import { ApiResponse } from "@traceo/types";
import { InputSecret, InputGroup, Button, Typography, Card } from "@traceo/ui";
import { useState } from "react";
import { loadProject } from "../../state/project/actions";

export const ApiKeySection = () => {
  const dispatch = useAppDispatch();
  const { project } = useProject();
  const [loading, setLoading] = useState<boolean>(false);

  const hasApiKey = !!project?.security?.apiKey;

  const handleGenerateApiKey = async () => {
    setLoading(true);
    await api
      .post<ApiResponse<string>>(`/api/project/api-key/generate/${project.id}`)
      .then(() => {
        dispatch(loadProject());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveApiKey = async () => {
    setLoading(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/project/api-key/remove/${project.id}`)
      .then(() => {
        dispatch(loadProject());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card title="API Key">
      <ColumnSection subtitle="Thanks to API Key you can fully integrate this project with Traceo SDK. Remember to not store this key in your code, better way is to use him like as environment variable.">
        {hasApiKey ? (
          <>
            <InputGroup>
              <InputSecret
                className="w-full"
                readOnly={true}
                defaultValue={project?.security?.apiKey}
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
              Last generated {dateUtils.fromNow(project?.security?.lastUpdate)} by{" "}
              {project?.security?.generatedBy}
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
