import { useEffect, useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useCommandPalette } from "../stores/commandPaletteStore";
import CommandItem from "./CommandItem";
import CommandSection from "./CommandSection";
import { useNavigate } from "react-router-dom";
import { Footer } from ".";
import { Command } from "../types/command";

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
  box-shadow: 0 0.5rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  // background: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
`;

const SearchIcon = styled.div`
  color: #57606a;
  margin-right: 12px;
  font-size: 16px;
`;

const SearchPrefix = styled.span`
  color: #57606a;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 0;
  border: none;
  background: transparent;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  position: relative;
  z-index: 2;
  color: #24292f;
  caret-color: #24292f;

  &::placeholder {
    color: #999;
  }
`;

const SearchSuggestion = styled.span`
  position: absolute;
  left: 44px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
  font-family: inherit;
  pointer-events: none;
  z-index: 1;
  padding: 8px 0;
  background: transparent;
  width: calc(100% - 54px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

const CommandPalette = () => {
  const { isOpen, closePalette } = useCommandPalette();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const navigate = useNavigate();

  const commands: Command[] = [
    { id: "pages-section", name: "Pages", type: 'section', action: () => {} },
    // 메인 기능 (장표)
    {
      id: "estimate",
      name: "견적서",
      action: () => navigate("/estimate"),
      icon: "📄",
      type: 'page',
      section: "pages",
      subCommands: [
        { id: "estimate-search", name: "견적서 검색", action: () => {}, icon: "🔍", type: 'action' },
        { id: "estimate-create", name: "견적서 작성", action: () => {}, icon: "✏️", type: 'action' },
        { id: "estimate-edit", name: "견적서 편집", action: () => {}, icon: "📝", type: 'action' },
        { id: "estimate-download", name: "견적서 다운로드", action: () => {}, icon: "⬇️", type: 'action' },
      ]
    },
    {
      id: "delivery",
      name: "납품서",
      action: () => navigate("/delivery"),
      icon: "📦",
      type: 'page',
      section: "pages",
      subCommands: [
        { id: "delivery-search", name: "납품서 검색", action: () => {}, icon: "🔍", type: 'action' },
        { id: "delivery-create", name: "납품서 작성", action: () => {}, icon: "✏️", type: 'action' },
        { id: "delivery-edit", name: "납품서 편집", action: () => {}, icon: "📝", type: 'action' },
        { id: "delivery-download", name: "납품서 다운로드", action: () => {}, icon: "⬇️", type: 'action' },
      ]
    },
    {
      id: "invoice",
      name: "청구서",
      action: () => navigate("/invoice"),
      icon: "💰",
      type: 'page',
      section: "pages",
      subCommands: [
        { id: "invoice-search", name: "청구서 검색", action: () => {}, icon: "🔍", type: 'action' },
        { id: "invoice-create", name: "청구서 작성", action: () => {}, icon: "✏️", type: 'action' },
        { id: "invoice-edit", name: "청구서 편집", action: () => {}, icon: "📝", type: 'action' },
        { id: "invoice-download", name: "청구서 다운로드", action: () => {}, icon: "⬇️", type: 'action' },
      ]
    },
    { id: "settings-section", name: "Settings", type: 'section', action: () => {} },
    // 설정
    {
      id: "company-settings",
      name: "회사 정보 설정",
      action: () => navigate("/settings/company"),
      icon: "🏢",
      type: 'page',
      section: "settings"
    },
    {
      id: "client-settings",
      name: "거래처 설정",
      action: () => navigate("/settings/clients"),
      icon: "👥",
      type: 'page',
      section: "settings"
    },
    {
      id: "template-settings",
      name: "템플릿 설정",
      action: () => navigate("/settings/templates"),
      icon: "🎨",
      type: 'page',
      section: "settings"
    },
  ];

  const getAllCommands = (commands: Command[]): Command[] => {
    return commands.reduce((acc: Command[], command) => {
      const result = [command];
      if (command.subCommands) {
        result.push(...command.subCommands.map(sub => ({
          ...sub,
          parentId: command.id,
          section: command.section
        })));
      }
      return [...acc, ...result];
    }, []);
  };

  const allCommands = useMemo(() => getAllCommands(commands), []);

  const filteredCommands = useMemo(() => {
    if (activeParentId) {
      const parentCommand = allCommands.find(cmd => cmd.id === activeParentId);
      if (parentCommand?.subCommands) {
        return parentCommand.subCommands.filter(cmd =>
          cmd.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      return [];
    }

    if (search) {
      const matchingCommands = allCommands.filter(command => {
        const matchesSearch = command.name.toLowerCase().includes(search.toLowerCase());
        const isSection = command.type === 'section';
        const isSubCommand = Boolean(command.parentId);
        return matchesSearch && !isSection && !isSubCommand;
      });

      if (matchingCommands.length > 0) {
        const result: Command[] = [];
        const topResult = matchingCommands[0];

        result.push(
          { id: "top-result", name: "Top result", type: 'topResult', action: () => {}, isSection: true },
          { ...topResult, isTopResult: true }
        );

        const pageCommands = matchingCommands.filter(cmd => cmd.section === "pages" && cmd.id !== topResult.id);
        if (pageCommands.length > 0) {
          result.push(
            { id: "pages-section", name: "Pages", type: 'section', action: () => {}, isSection: true },
            ...pageCommands
          );
        }

        const settingsCommands = matchingCommands.filter(cmd => cmd.section === "settings" && cmd.id !== topResult.id);
        if (settingsCommands.length > 0) {
          result.push(
            { id: "settings-section", name: "Settings", type: 'section', action: () => {}, isSection: true },
            ...settingsCommands
          );
        }

        return result;
      }
    }

    return commands.filter(command => !command.parentId);
  }, [search, activeParentId, allCommands]);

  const getSuggestion = () => {
    if (!search || activeParentId) return null;
    const topResult = filteredCommands.find(cmd => cmd.isTopResult);
    if (!topResult) return null;

    const searchLower = search.toLowerCase();
    const nameLower = topResult.name.toLowerCase();
    if (!nameLower.startsWith(searchLower)) return null;

    return {
      typed: search,
      suggestion: topResult.name.slice(search.length)
    };
  };

  const suggestion = getSuggestion();

  const handleTabPress = () => {
    const selectedCommand = filteredCommands[selectedIndex];
    if (selectedCommand?.type === 'page' && selectedCommand.subCommands) {
      setActiveParentId(selectedCommand.id);
      setSearch("");
      setSelectedIndex(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (activeParentId && newValue === "") {
      setActiveParentId(null);
    }
    setSearch(newValue);
    setSelectedIndex(0);
  };

  const getSelectableCommands = (commands: Command[]) => {
    return commands.filter(cmd => !cmd.isSection && cmd.type !== 'section');
  };

  const handleArrowNavigation = (direction: 'up' | 'down') => {
    const selectableCommands = getSelectableCommands(filteredCommands);
    if (selectableCommands.length === 0) return;

    if (direction === 'down') {
      const nextIndex = selectableCommands.findIndex((cmd, i) => {
        const currentCmd = selectableCommands[i - 1];
        return currentCmd && filteredCommands.indexOf(currentCmd) === selectedIndex;
      });

      setSelectedIndex(
        nextIndex >= 0
          ? filteredCommands.indexOf(selectableCommands[nextIndex])
          : filteredCommands.indexOf(selectableCommands[0])
      );
    } else {
      const currentSelectedIndex = selectableCommands.findIndex(
        cmd => filteredCommands.indexOf(cmd) === selectedIndex
      );

      const prevIndex = currentSelectedIndex <= 0
        ? selectableCommands.length - 1
        : currentSelectedIndex - 1;

      setSelectedIndex(filteredCommands.indexOf(selectableCommands[prevIndex]));
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    const keyHandlers: Record<string, () => void> = {
      Escape: () => {
        if (activeParentId) {
          e.preventDefault();
          setActiveParentId(null);
          setSearch("");
          setSelectedIndex(0);
        } else {
          closePalette();
        }
      },
      ArrowDown: () => {
        e.preventDefault();
        handleArrowNavigation('down');
      },
      ArrowUp: () => {
        e.preventDefault();
        handleArrowNavigation('up');
      },
      Tab: () => {
        e.preventDefault();
        handleTabPress();
      },
      Enter: () => {
        e.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand && !selectedCommand.isSection && selectedCommand.type !== 'section') {
          selectedCommand.action();
          closePalette();
        }
      },
      Backspace: () => {
        if (activeParentId && search === "") {
          e.preventDefault();
          setActiveParentId(null);
        }
      }
    };

    const handler = keyHandlers[e.key];
    if (handler) {
      handler();
    }
  }, [isOpen, filteredCommands, selectedIndex, activeParentId, search, closePalette]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const getInputPrefix = () => {
    if (activeParentId) {
      const parentCommand = getAllCommands(commands).find(cmd => cmd.id === activeParentId);
      return `${parentCommand?.name || ""} › `;
    }
    return "";
  };

  return (
    <Overlay onClick={closePalette}>
      <Container onClick={(e) => e.stopPropagation()}>
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          {activeParentId && <SearchPrefix>{getInputPrefix()}</SearchPrefix>}
          <SearchInput
            autoFocus
            placeholder="명령어를 입력하세요..."
            value={search}
            onChange={handleInputChange}
          />
          {suggestion && (
            <SearchSuggestion>
              {suggestion.typed}
              {suggestion.suggestion}
            </SearchSuggestion>
          )}
        </SearchContainer>
        <CommandList>
          {filteredCommands.length === 0 ? (
            <EmptyState>검색 결과가 없습니다</EmptyState>
          ) : (
            <>
              {activeParentId ? (
                // 서브메뉴 표시
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
                            onClick={() => {
                              command.action();
                              closePalette();
                            }}
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
                      onCommandClick={(command) => {
                        command.action();
                        closePalette();
                      }}
                    />
                  )}

                  {/* Settings Section */}
                  {filteredCommands.some(cmd => cmd.section === "settings" && !cmd.isTopResult) && (
                    <CommandSection
                      title="Settings"
                      commands={filteredCommands.filter(cmd => cmd.section === "settings" && !cmd.isTopResult)}
                      selectedIndex={selectedIndex}
                      startIndex={filteredCommands.findIndex(cmd => cmd.section === "settings" && !cmd.isTopResult)}
                      onCommandClick={(command) => {
                        command.action();
                        closePalette();
                      }}
                      isLast={true}
                    />
                  )}
                </>
              )}
            </>
          )}
        </CommandList>
        <Footer activeParentId={activeParentId} />
      </Container>
    </Overlay>
  );
};

export default CommandPalette;
