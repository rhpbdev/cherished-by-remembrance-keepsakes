import {
  FILL_COLOR,
  type ActiveTool,
  type Editor,
} from '@/features/editor/types';
import { ToolSidebarWrapper } from '@/features/editor/components/sidebar/tool-sidebar-wrapper';

import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from '../tools/color-picker';

interface FillColorSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FillColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FillColorSidebarProps) => {
  const value = editor?.getActiveFillColor() || FILL_COLOR;

  const onClose = () => {
    onChangeActiveTool('select');
  };

  const onChange = (value: string) => {
    editor?.changeFillColor(value);
  };

  return (
    <ToolSidebarWrapper
      isOpen={activeTool === 'fill'}
      onClose={onClose}
      title='Fill Color'
      description='Change the fill color of the selected object.'
    >
      <ScrollArea>
        <div className='p-4 space-y-6'>
          <ColorPicker value={value} onChange={onChange} />
        </div>
      </ScrollArea>
    </ToolSidebarWrapper>
  );
};
