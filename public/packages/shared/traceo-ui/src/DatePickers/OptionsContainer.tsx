import { ManipulateType } from "dayjs";
import styled from "styled-components";

export type RelativeTimeOption = {
  label: string;
  value: number;
  unit: ManipulateType;
  onClick?: () => void;
};

interface Props {
  options: RelativeTimeOption[];
  onSelect: (option: RelativeTimeOption) => void;
}
export const OptionsContainer = ({ onSelect, options }: Props) => {
  const onSelectOptions = (e: any, option: RelativeTimeOption) => {
    e.stopPropagation();
    onSelect(option);
  };

  return (
    <RelativeTimeWrapper>
      <ul className="pl-0 list-none overflow-y-scroll">
        {options.map((option, index) => (
          <RelativeTimeOption key={index} onClick={(e) => onSelectOptions(e, option)}>
            {option.label}
          </RelativeTimeOption>
        ))}
      </ul>
    </RelativeTimeWrapper>
  );
};

const RelativeTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-bg-secondary);
  width: 10rem; /* 160px */
  grid-column: span 4 / span 4;
  max-height: 350px;
`;

const RelativeTimeOption = styled.li`
  cursor: pointer;
  padding-left: 0.75rem; /* 12px */
  padding-right: 0.75rem; /* 12px */
  padding-top: 0.5rem; /* 8px */
  padding-bottom: 0.5rem; /* 8px */

  &:hover {
    background-color: var(--color-bg-secondary);
  }
`;
