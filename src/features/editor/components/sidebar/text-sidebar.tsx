import { type ActiveTool, type Editor } from "@/features/editor/types";
import { ToolSidebarWrapper } from "@/features/editor/components/sidebar/tool-sidebar-wrapper";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TextSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <ToolSidebarWrapper
      isOpen={activeTool === "text"}
      onClose={onClose}
      title='Text'
      description='Add text to your design.'
    >
      <ScrollArea>
        <div className='p-4 space-y-6 border-b'>
          <Button className='w-full' onClick={() => editor?.addText()}>
            Add Text
          </Button>
        </div>
      </ScrollArea>
    </ToolSidebarWrapper>
  );
};
