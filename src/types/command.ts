export type CommandType = 'page' | 'action' | 'section' | 'topResult';

export type Command = {
  id: string;
  name: string;
  action: () => void;
  icon?: string;
  type: CommandType;
  subCommands?: Command[];
  parentId?: string;
  section?: string;
  isSection?: boolean;
  isTopResult?: boolean;
};
