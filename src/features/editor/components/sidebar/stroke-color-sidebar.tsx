import {
  STROKE_COLOR,
  type ActiveTool,
  type Editor,
} from "@/features/editor/types";
import { ToolSidebarWrapper } from "@/features/editor/components/sidebar/tool-sidebar-wrapper";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "@/features/editor/components/tools/color-picker";

interface StrokeColorSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeColorSidebarProps) => {
  const value = editor?.getActiveStrokeColor() || STROKE_COLOR;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };

  return (
    <ToolSidebarWrapper
      isOpen={activeTool === "stroke-color"}
      onClose={onClose}
      title='Stroke Color'
      description='Change the stroke color of the selected object.'
    >
      <ScrollArea>
        <div className='p-4 space-y-6'>
          <ColorPicker value={value} onChange={onChange} />
        </div>
      </ScrollArea>
    </ToolSidebarWrapper>
  );
};
