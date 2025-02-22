import { useEffect, useState } from "react";
import styled from "styled-components";
import { useCommandPalette } from "../stores/commandPaletteStore";
import CommandItem from "./CommandItem";
import { useNavigate } from "react-router-dom";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
`;

const Container = styled.div`
  width: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eaeaea;
  background: #f8f9fa;
`;

const SearchIcon = styled.div`
  color: #57606a;
  margin-right: 12px;
  font-size: 16px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 0;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #999;
  }
`;

const CommandList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 16px;
  text-align: center;
  color: #666;
`;

const Footer = styled.div`
  padding: 8px 16px;
  border-top: 1px solid #eaeaea;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #57606a;
`;

const ShortcutGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Shortcut = styled.span`
  padding: 2px 6px;
  background: #e9ecef;
  border-radius: 4px;
  color: #57606a;
  font-size: 12px;
`;

type Command = {
  id: string;
  name: string;
  action: () => void;
  icon?: string;
};

const CommandPalette = () => {
  const { isOpen, closePalette } = useCommandPalette();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: Command[] = [
    { id: "home", name: "홈으로 이동", action: () => navigate("/"), icon: "🏠" },
    { id: "about", name: "About 페이지로 이동", action: () => navigate("/about"), icon: "ℹ️" },
    { id: "users", name: "사용자 페이지로 이동", action: () => navigate("/users"), icon: "👥" },
  ];

  const filteredCommands = commands.filter((command) =>
    command.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        closePalette();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          selectedCommand.action();
          closePalette();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, closePalette]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={closePalette}>
      <Container onClick={(e) => e.stopPropagation()}>
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            autoFocus
            placeholder="명령어를 입력하세요..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
        </SearchContainer>
        <CommandList>
          {filteredCommands.length === 0 ? (
            <EmptyState>검색 결과가 없습니다</EmptyState>
          ) : (
            filteredCommands.map((command, index) => (
              <CommandItem
                key={command.id}
                name={command.name}
                icon={command.icon}
                isSelected={index === selectedIndex}
                onClick={() => {
                  command.action();
                  closePalette();
                }}
              />
            ))
          )}
        </CommandList>
        <Footer>
          <ShortcutGroup>
            <Shortcut>↑</Shortcut>
            <Shortcut>↓</Shortcut>
            <span>이동</span>
          </ShortcutGroup>
          <ShortcutGroup>
            <Shortcut>esc</Shortcut>
            <span>닫기</span>
          </ShortcutGroup>
        </Footer>
      </Container>
    </Overlay>
  );
};

export default CommandPalette;
