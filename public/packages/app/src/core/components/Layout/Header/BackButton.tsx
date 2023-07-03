import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Button = styled.div`
  padding: 2px;
  cursor: pointer;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  padding-inline: 14px;
  margin-right: 14px;
  cursor: pointer;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-right: 1px solid var(--color-text-primary);
  &:hover {
    background-color: var(--color-bg-secondary);
  }
`;

export const BackButton = () => {
  const navigate = useNavigate();

  const onBack = () => {
    navigate("/dashboard/projects");
  };

  return (
    <Button onClick={() => onBack()}>
      <LeftOutlined />
      <span>Back</span>
    </Button>
  );
};
