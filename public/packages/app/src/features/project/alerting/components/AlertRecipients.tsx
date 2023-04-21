import { ProjectMember } from "@traceo/types";
import { Avatar, FieldLabel, Select, SelectOptionProps, Typography } from "@traceo/ui";
import { useEffect, useState } from "react";
import { loadMembers } from "../../settings/state/members/actions";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../store/index";
import { StoreState } from "../../../../store/types";
import { useSelector } from "react-redux";
import { BellOutlined, MailOutlined, MinusOutlined, RedEnvelopeFilled } from "@ant-design/icons";
import styled from "styled-components";
import { RowContainer } from "../CreateAlertPage";
import { SearchWrapper } from "src/core/components/SearchWrapper";

type AlertRecipient = {
  id: string;
  name: string;
  email: string;
  gravatar?: string;
};

interface Props {
  selectedMembers: ProjectMember[];
  setSelectedMembers: (m: ProjectMember[]) => void;
}
export const AlertRecipients = ({ setSelectedMembers, selectedMembers = [] }: Props) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { members, hasFetched } = useSelector((state: StoreState) => state.members);

  useEffect(() => {
    dispatch(
      loadMembers({
        id
      })
    );
  }, []);

  const selectMembersOptions = (): SelectOptionProps[] => {
    const allowedMembers = members.filter((member) => !selectedMembers.includes(member));
    return allowedMembers.map((member) => ({
      label: member?.name,
      description: member?.email,
      value: member
    }));
  };

  const onRemove = (member: ProjectMember) => {
    const members = selectedMembers.filter((m) => m !== member);
    setSelectedMembers(members);
  };

  return (
    <div>
      <SearchWrapper>
        <Select
          value={null}
          width={550}
          placeholder="Select member..."
          onChange={(e) => setSelectedMembers([...selectedMembers, e?.value])}
          options={selectMembersOptions()}
        />
      </SearchWrapper>

      <div className="pt-3">
        {selectedMembers.length === 0 && (
          <RowContainer>
            <div className="w-full text-center justify-center py-5">
              <span>Recipients not selected</span>
            </div>
          </RowContainer>
        )}
        {selectedMembers.map((member) => (
          <RowContainer key={member.id}>
            <div className="flex flex-row items-center gap-x-3">
              <Avatar size="sm" alt={member?.name} src={member?.gravatar} />
              <div className="flex flex-col">
                <span>{member?.name}</span>
                <span>{member?.email}</span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-9">
              {member?.email && <MailOutlined />}
              <BellOutlined />
              <MinusOutlined
                onClick={() => onRemove(member)}
                className="bg-red-500 p-1 rounded-full cursor-pointer hover:bg-red-700 duration-200"
              />
            </div>
          </RowContainer>
        ))}
      </div>
    </div>
  );
};
