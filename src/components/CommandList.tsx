import { Command } from "../types/command";
import { CommandItem, CommandSection } from ".";
import styled from "styled-components";

const CommandListContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 16px;
  text-align: center;
  color: #666;
`;

type Props = Readonly<{
  filteredCommands: Command[];
  selectedIndex: number;
  activeParentId: string | null;
  search: string;
  onCommandClick: (command: Command) => void;
}>;

const CommandList = ({
  filteredCommands,
  selectedIndex,
  activeParentId,
  search,
  onCommandClick,
}: Props) => {
  if (filteredCommands.length === 0) {
    return (
      <CommandListContainer>
        <EmptyState>검색 결과가 없습니다</EmptyState>
      </CommandListContainer>
    );
  }

  return (
    <CommandListContainer>
      {activeParentId ? (
        // 서브메뉴 표시
        filteredCommands.map((command, index) => (
          <CommandItem
            key={command.id}
            name={command.name}
            icon={command.icon}
            isSelected={index === selectedIndex}
            onClick={() => onCommandClick(command)}
            type={command.type}
            hasSubCommands={false}
          />
        ))
      ) : (
        <>
          {search && filteredCommands.find(cmd => cmd.isTopResult) && (
            <>
              <CommandItem
                key="top-result"
                name="Top result"
                type="topResult"
                isSection={true}
                isSelected={false}
                onClick={() => {}}
              />
              {filteredCommands
                .filter(cmd => cmd.isTopResult)
                .map((command, index) => (
                  <CommandItem
                    key={command.id}
                    name={command.name}
                    icon={command.icon}
                    isSelected={index === selectedIndex}
                    onClick={() => onCommandClick(command)}
                    type={command.type}
                    hasSubCommands={Boolean(command.subCommands)}
                    isTopResult={true}
                  />
                ))}
            </>
          )}

          {/* Pages Section */}
          {filteredCommands.some(cmd => cmd.section === "pages" && !cmd.isTopResult) && (
            <CommandSection
              title="Pages"
              commands={filteredCommands.filter(cmd => cmd.section === "pages" && !cmd.isTopResult)}
              selectedIndex={selectedIndex}
              startIndex={filteredCommands.findIndex(cmd => cmd.section === "pages" && !cmd.isTopResult)}
              onCommandClick={onCommandClick}
            />
          )}

          {/* Settings Section */}
          {filteredCommands.some(cmd => cmd.section === "settings" && !cmd.isTopResult) && (
            <CommandSection
              title="Settings"
              commands={filteredCommands.filter(cmd => cmd.section === "settings" && !cmd.isTopResult)}
              selectedIndex={selectedIndex}
              startIndex={filteredCommands.findIndex(cmd => cmd.section === "settings" && !cmd.isTopResult)}
              onCommandClick={onCommandClick}
              isLast={true}
            />
          )}
        </>
      )}
    </CommandListContainer>
  );
};

export default CommandList;
