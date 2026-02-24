import { EAppRole } from "@core/enums/AppRole";

export interface RoleSelectionCardProps {
  role: EAppRole;
  title: string;
  description: string;
  iconName: string;
  isSelected: boolean;
  onSelect: (role: EAppRole) => void;
}
