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
      variant='ghost'
      onClick={onClick}
      className={cn(
        'group w-full h-auto aspect-video p-3 py-2 flex flex-col rounded-none border-0 transition-colors duration-200 hover:text-purple-500',
        isActive && 'bg-muted text-primary',
      )}
    >
      <span className='rounded-md bg-transparent p-2 transition-all duration-200 group-hover:bg-white group-hover:shadow-md'>
        <Icon className='size-5 shrink-0 stroke-2 transition-colors duration-200 group-hover:text-purple-500' />
      </span>
      <span className='text-xs font-medium capitalize tracking-normal transition-colors duration-200 group-hover:text-purple-500'>
        {label}
      </span>
    </Button>
  );
};
