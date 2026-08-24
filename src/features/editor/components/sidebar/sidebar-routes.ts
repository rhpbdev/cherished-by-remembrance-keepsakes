import {
  LayoutTemplateIcon,
  ImageIcon,
  SettingsIcon,
  SparklesIcon,
  TypeOutlineIcon,
  type LucideIcon,
} from 'lucide-react';

import { type ActiveTool } from '@/features/editor/types';

export interface SidebarRoute {
  icon: LucideIcon;
  label: string;
  tool: ActiveTool;
}

// Shared by the desktop left rail (Sidebar) and the mobile bottom bar (MobileSidebar)
// so the two stay in sync.
export const SIDEBAR_ROUTES: SidebarRoute[] = [
  { icon: LayoutTemplateIcon, label: 'Templates', tool: 'templates' },
  { icon: ImageIcon, label: 'Images', tool: 'images' },
  { icon: TypeOutlineIcon, label: 'Text', tool: 'text' },
  { icon: SparklesIcon, label: 'Elements', tool: 'elements' },
  { icon: SettingsIcon, label: 'Settings', tool: 'settings' },
];
