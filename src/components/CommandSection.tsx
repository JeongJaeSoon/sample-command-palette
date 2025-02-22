import { Command } from "../types/command";
import CommandItem from "./CommandItem";
import styled from "styled-components";

const Container = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #eaeaea;
  padding-top: 0.2rem;
  ${({ isLast }) => isLast && `border-bottom: none;`}
`;

type Props = Readonly<{
  title: string;
  commands: Command[];
  selectedIndex: number;
  startIndex: number;
  onCommandClick: (command: Command) => void;
  isLast?: boolean;
}>;

const CommandSection = ({
  title,
  commands,
  selectedIndex,
  startIndex,
  onCommandClick,
  isLast,
}: Props) => {
  return (
    <Container isLast={isLast}>
      <CommandItem
        key={`${title.toLowerCase()}-section`}
        name={title}
        type="section"
        isSection={true}
        isSelected={false}
        onClick={() => {}}
      />
      {commands.map((command, index) => (
        <CommandItem
          key={command.id}
          name={command.name}
          icon={command.icon}
          isSelected={selectedIndex === startIndex + index}
          onClick={() => onCommandClick(command)}
          type={command.type}
          hasSubCommands={Boolean(command.subCommands)}
          isTopResult={command.isTopResult}
        />
      ))}
    </Container>
  );
};

export default CommandSection;
