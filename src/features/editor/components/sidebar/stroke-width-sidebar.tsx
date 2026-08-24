import {
  STROKE_COLOR,
  type ActiveTool,
  type Editor,
} from "@/features/editor/types";
import { ToolSidebarWrapper } from "@/features/editor/components/sidebar/tool-sidebar-wrapper";

import { ScrollArea } from "@/components/ui/scroll-area";

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeWidthSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) => {
//   const value = editor?.getActiveStrokeWidth() || STROKE_COLOR;

  const onClose = () => {
    onChangeActiveTool("select");
  };

//   const onChange = (value: string) => {
//     editor?.changeStrokeWidth(value);
//   };

  return (
    <ToolSidebarWrapper
      isOpen={activeTool === "stroke-width"}
      onClose={onClose}
      title='Stroke Width'
      description='Change the stroke width of the selected object.'
    >
      <ScrollArea>
        <div className='p-4 space-y-6'>
          
        </div>
      </ScrollArea>
    </ToolSidebarWrapper>
  );
};
