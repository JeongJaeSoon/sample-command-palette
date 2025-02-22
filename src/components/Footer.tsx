import styled from "styled-components";
import { isMacOS } from '../utils/platform';

const FooterContainer = styled.div`
  padding: 0.5rem 1rem;
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

type Props = Readonly<{
  activeParentId: string | null;
}>;

const Footer = ({ activeParentId }: Props) => {
  const shortcutText = isMacOS() ? '⌘ + K' : 'Ctrl + K';

  return (
    <FooterContainer>
      <ShortcutGroup>
        <Shortcut>↑</Shortcut>
        <Shortcut>↓</Shortcut>
        <span>이동</span>
      </ShortcutGroup>
      {activeParentId ? (
        <ShortcutGroup>
          <Shortcut>backspace</Shortcut>
          <span>뒤로</span>
        </ShortcutGroup>
      ) : (
        <ShortcutGroup>
          <Shortcut>{shortcutText}</Shortcut>
          <span>닫기</span>
        </ShortcutGroup>
      )}
    </FooterContainer>
  );
};

export default Footer;
