'use client';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ToolSidebarClose } from '@/features/editor/components/sidebar/tool-sidebar-close';
import { ToolSidebarHeader } from '@/features/editor/components/sidebar/tool-sidebar-header';

interface ToolSidebarWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

// Renders a tool panel as an inline docked <aside> on desktop and as a slide-in
// Sheet (drawer) on mobile (< md). Each tool panel passes its own body as children
// so the desktop/mobile chrome lives in one place.
export const ToolSidebarWrapper = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ToolSidebarWrapperProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side='left' className='p-0 gap-0'>
          <SheetHeader className='p-4 border-b space-y-1 text-left'>
            <SheetTitle className='text-sm font-medium normal-case tracking-normal font-sans'>
              {title}
            </SheetTitle>
            {description && (
              <SheetDescription className='text-xs'>
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-40 w-90 h-full flex flex-col',
        isOpen ? 'visible' : 'hidden',
      )}
    >
      <ToolSidebarHeader title={title} description={description} />
      {children}
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
