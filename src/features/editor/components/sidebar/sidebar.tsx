'use client';

import { type ActiveTool } from '@/features/editor/types';
import { SidebarItem } from '@/features/editor/components/sidebar/sidebar-items';
import { SIDEBAR_ROUTES } from '@/features/editor/components/sidebar/sidebar-routes';

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  return (
    <aside className='bg-muted hidden md:flex flex-col w-21 h-full overflow-y-auto border-r-1'>
      <ul className='flex flex-col'>
        {SIDEBAR_ROUTES.map((route) => (
          <SidebarItem
            key={route.tool}
            icon={route.icon}
            label={route.label}
            isActive={activeTool === route.tool}
            onClick={() => onChangeActiveTool(route.tool)}
          />
        ))}
      </ul>
    </aside>
  );
};
