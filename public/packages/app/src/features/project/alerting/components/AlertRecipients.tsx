import { IMember, ProjectMember, Setter } from "@traceo/types";
import { Avatar, Row, Select, SelectOptionProps } from "@traceo/ui";
import { useEffect } from "react";
import { loadMembers } from "../../settings/state/members/actions";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../store/index";
import { StoreState } from "../../../../store/types";
import { useSelector } from "react-redux";
import { BellOutlined, MailOutlined, MinusOutlined } from "@ant-design/icons";
import { SearchWrapper } from "../../../../core/components/SearchWrapper";
import { RowContainer } from "../utils";

interface Props {
  selectedMembers: IMember[];
  setSelectedMembers: Setter<IMember[]>;
}
export const AlertRecipients = ({ setSelectedMembers, selectedMembers = [] }: Props) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { members } = useSelector((state: StoreState) => state.members);

  useEffect(() => {
    dispatch(
      loadMembers({
        id
      })
    );
  }, []);

  const selectMembersOptions = (): SelectOptionProps[] => {
    const alreadySelected = selectedMembers.map((e) => e.id);
    const allowedMembers = members.filter((member) => !alreadySelected.includes(member.id));

    return allowedMembers.map((member) => ({
      label: member?.name,
      description: member?.email,
      value: member
    }));
  };

  const onRemove = (member: IMember) => {
    const members = selectedMembers.filter((m) => m !== member);
    setSelectedMembers(members);
  };

  const onSelect = (member: ProjectMember) => {
    const selectedMember: IMember = {
      id: member.id,
      user: {
        id: member.userId,
        ...member
      },
      project: undefined,
      ...member
    };

    setSelectedMembers([...selectedMembers, selectedMember]);
  };

  return (
    <div>
      <SearchWrapper>
        <Select
          value={null}
          width={550}
          placeholder="Select member..."
          onChange={(e) => onSelect(e?.value)}
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
            <Row gap="x-3">
              <Avatar size="sm" alt={member?.user.name} src={member?.user.gravatar} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{member?.user.name}</span>
                <span className="text-xs">{member?.user.email}</span>
              </div>
            </Row>
            <Row gap="x-5">
              {member?.user.email && <MailOutlined />}
              <BellOutlined />
              <MinusOutlined
                onClick={() => onRemove(member)}
                className="bg-red-500 p-1 rounded-full cursor-pointer hover:bg-red-700 duration-200"
              />
            </Row>
          </RowContainer>
        ))}
      </div>
    </div>
  );
};
