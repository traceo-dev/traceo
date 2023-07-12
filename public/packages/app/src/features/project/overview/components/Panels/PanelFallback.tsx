import { WarningFilled } from "@ant-design/icons";
import { Row } from "@traceo/ui";
import styled from "styled-components";

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const InfoHeader = styled.span`
  font-weight: 500;
  font-size: 24px;
`;

const InfoExplanation = styled.span`
  font-size: 12px;
`;

interface Props {
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
  isErrorExplain: boolean;
  children: JSX.Element;
}
export const PanelFallback = ({
  isEmpty,
  isLoading,
  isError,
  children,
  isErrorExplain
}: Props) => {
  if (isError) {
    return (
      <InfoContainer>
        <Row gap="x-2">
          <WarningFilled className="text-error text-3xl" />
          <InfoHeader>Error</InfoHeader>
        </Row>

        {isErrorExplain && (
          <InfoExplanation>
            An error occurred while fetching data. Please try again later.
          </InfoExplanation>
        )}
      </InfoContainer>
    );
  }

  if (isEmpty && !isLoading) {
    return (
      <InfoContainer>
        <InfoHeader>No data</InfoHeader>
        {isErrorExplain && (
          <InfoExplanation>No data found for the specified time period.</InfoExplanation>
        )}
      </InfoContainer>
    );
  }

  return children;
};
