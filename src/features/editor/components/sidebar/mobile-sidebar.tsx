'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { type ActiveTool } from '@/features/editor/types';
import { SIDEBAR_ROUTES } from '@/features/editor/components/sidebar/sidebar-routes';

interface MobileSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

// Bottom tab bar shown only below the `md` breakpoint; mirrors the desktop left
// rail (Sidebar) using the same SIDEBAR_ROUTES.
export const MobileSidebar = ({
  activeTool,
  onChangeActiveTool,
}: MobileSidebarProps) => {
  return (
    <nav className='md:hidden fixed inset-x-0 bottom-0 z-50 h-14 bg-muted border-t flex items-stretch'>
      {SIDEBAR_ROUTES.map((route) => {
        const Icon = route.icon;
        const isActive = activeTool === route.tool;

        return (
          <Button
            key={route.tool}
            variant='ghost'
            onClick={() => onChangeActiveTool(route.tool)}
            className={cn(
              'flex-1 h-full flex flex-col items-center justify-center gap-y-0.5 rounded-none border-0 px-1 text-muted-foreground hover:text-purple-500',
              isActive && 'text-primary bg-white/60',
            )}
          >
            <Icon className='size-5 shrink-0 stroke-2' />
            <span className='text-[10px] font-medium capitalize leading-none'>
              {route.label}
            </span>
          </Button>
        );
      })}
    </nav>
  );
};
