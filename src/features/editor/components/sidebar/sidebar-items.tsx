import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'group flex aspect-video h-auto w-full flex-col rounded-none border-0 p-3 py-2 transition-colors duration-200 hover:bg-primary/30 hover:text-purple-500',
        isActive &&
          'bg-purple-500 text-white hover:bg-purple-500 hover:text-white',
      )}
    >
      <span
        className={cn(
          'rounded-md bg-transparent p-2 transition-all duration-200 group-hover:bg-white group-hover:shadow-md',
          isActive && 'group-hover:bg-purple-500 group-hover:shadow-none',
        )}
      >
        <Icon
          className={cn(
            'size-5 shrink-0 stroke-2 transition-colors duration-200 group-hover:text-purple-500',
            isActive && 'group-hover:text-white',
          )}
        />
      </span>
      <span
        className={cn(
          'text-xs font-medium tracking-normal capitalize transition-colors duration-200 group-hover:text-purple-500',
          isActive && 'group-hover:text-white',
        )}
      >
        {label}
      </span>
    </Button>
  );
};
