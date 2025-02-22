import React from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px;
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

type Props = Readonly<{
  search: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestion: { typed: string; suggestion: string } | null;
  activeParentId: string | null;
  getInputPrefix: () => string;
}>;

const CommandSearch = ({
  search,
  onChange,
  suggestion,
  activeParentId,
  getInputPrefix,
}: Props) => {
  return (
    <SearchContainer>
      <SearchIcon>🔍</SearchIcon>
      {activeParentId && <SearchPrefix>{getInputPrefix()}</SearchPrefix>}
      <SearchInput
        autoFocus
        placeholder="명령어를 입력하세요..."
        value={search}
        onChange={onChange}
      />
      {suggestion && (
        <SearchSuggestion>
          {suggestion.typed}
          {suggestion.suggestion}
        </SearchSuggestion>
      )}
    </SearchContainer>
  );
};

export default CommandSearch;
