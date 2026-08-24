import {
  CircleIcon,
  SquareIcon,
  SquareRoundCornerIcon,
  TriangleIcon,
} from 'lucide-react';

import type { ActiveTool, Editor } from '@/features/editor/types';
import { ShapeTool } from '@/features/editor/components/tools/shape-tool';
import { ToolSidebarWrapper } from '@/features/editor/components/sidebar/tool-sidebar-wrapper';

import { ScrollArea } from '@/components/ui/scroll-area';

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool('select');
  };

  return (
    <ToolSidebarWrapper
      isOpen={activeTool === 'elements'}
      onClose={onClose}
      title='Elements'
      description='Add shapes, lines, icons and more to your design.'
    >
      <ScrollArea>
        <div className='grid grid-cols-3 gap-4 p-4'>
          <ShapeTool onClick={() => editor?.addCircle()} icon={CircleIcon} />
          <ShapeTool onClick={() => editor?.addRectangle()} icon={SquareIcon} />
          <ShapeTool
            onClick={() => editor?.addRectangleRounded()}
            icon={SquareRoundCornerIcon}
          />
          <ShapeTool
            onClick={() => editor?.addDiamond()}
            icon={SquareIcon}
            iconClassName='rotate-45'
          />
          <ShapeTool
            onClick={() => editor?.addTriangle()}
            icon={TriangleIcon}
          />
          <ShapeTool
            onClick={() => editor?.addTriangleInverse()}
            icon={TriangleIcon}
            iconClassName='rotate-180'
          />
        </div>
      </ScrollArea>
    </ToolSidebarWrapper>
  );
};
