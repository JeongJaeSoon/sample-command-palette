import styled from "styled-components";

const Item = styled.div<{ isSelected: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  background: ${({ isSelected }) => (isSelected ? "#f5f5f5" : "transparent")};

  &:hover {
    background: #f5f5f5;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #57606a;
`;

const Name = styled.span`
  color: #24292f;
  font-size: 14px;
`;

const ActionHint = styled.span`
  font-size: 12px;
  color: #57606a;
  padding: 2px 6px;
  background: #e9ecef;
  border-radius: 4px;
`;

type Props = Readonly<{
  name: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: string;
}>;

const CommandItem = ({ name, isSelected, onClick, icon = "➜" }: Props) => {
  return (
    <Item isSelected={isSelected} onClick={onClick}>
      <LeftSection>
        <Icon>{icon}</Icon>
        <Name>{name}</Name>
      </LeftSection>
      {isSelected && (
        <RightSection>
          <ActionHint>Enter</ActionHint>
        </RightSection>
      )}
    </Item>
  );
};

export default CommandItem;
