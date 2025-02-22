import styled from "styled-components";

const Item = styled.div<{ isSelected: boolean; isTopResult?: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  background: ${({ isSelected }) => (isSelected ? "#f5f5f5" : "transparent")};
  border-bottom: ${({ isTopResult }) => isTopResult ? "1px solid #eaeaea" : "none"};

  &:hover {
    background: #f5f5f5;
  }
`;

const SectionHeader = styled.div`
  padding: 0.7rem 1rem;
  font-size: 12px;
  font-weight: 500;
  color: #57606a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  user-select: none;
`;

const TopResultHeader = styled(SectionHeader)`
  color: #57606a;
  font-size: 11px;
  padding: 6px 16px;
  background: transparent;
  opacity: 0.8;
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
  color: #57606a;
  font-size: 12px;
`;

const Icon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #57606a;
`;

const Name = styled.span<{ isTopResult?: boolean }>`
  color: #24292f;
  font-size: 14px;
  ${({ isTopResult }) => isTopResult && `
    font-weight: 500;
  `}
`;

const ActionKey = styled.span`
  padding: 1px 4px;
  background: #e9ecef;
  border-radius: 4px;
  color: #57606a;
`;

type CommandType = 'page' | 'action' | 'section' | 'topResult';

type Props = Readonly<{
  name: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: string;
  type: CommandType;
  hasSubCommands?: boolean;
  isSection?: boolean;
  isTopResult?: boolean;
}>;

const CommandItem = ({
  name,
  isSelected,
  onClick,
  icon = "➜",
  type,
  hasSubCommands,
  isSection,
  isTopResult
}: Props) => {
  if (isSection) {
    if (type === 'topResult') {
      return <TopResultHeader>Top result</TopResultHeader>;
    }
    return <SectionHeader>{name}</SectionHeader>;
  }

  const getActionHint = () => {
    if (!isSelected) return null;

    if (type === 'page' && hasSubCommands) {
      return (
        <RightSection>
          <ActionKey>Enter</ActionKey> to jump to <ActionKey>Tab</ActionKey> to search
        </RightSection>
      );
    }

    if (type === 'page') {
      return (
        <RightSection>
          Jump to
        </RightSection>
      );
    }

    return (
      <RightSection>
        <ActionKey>Enter</ActionKey>
      </RightSection>
    );
  };

  return (
    <Item isSelected={isSelected} onClick={onClick} isTopResult={isTopResult}>
      <LeftSection>
        <Icon>{icon}</Icon>
        <Name isTopResult={isTopResult}>{name}</Name>
      </LeftSection>
      {getActionHint()}
    </Item>
  );
};

export default CommandItem;
