export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  badge?: number;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeItemId?: string;
  onItemClick?: (itemId: string) => void;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
} 