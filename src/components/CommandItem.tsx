import styled from "styled-components";

const Item = styled.div<{ isSelected: boolean }>`
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  background: ${({ isSelected }) => (isSelected ? "#e0e0e0" : "transparent")};

  &:hover {
    background: #f0f0f0;
  }
`;

type Props = Readonly<{
  name: string;
  isSelected: boolean;
  onClick: () => void;
}>

const CommandItem = ({ name, isSelected, onClick }: Props) => {
  return (
    <Item isSelected={isSelected} onClick={onClick}>
      {name}
    </Item>
  );
}

export default CommandItem;
