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
          <Button className='w-full h-16' variant='outline' size='lg' onClick={() => editor?.addText("Heading", {
            fontSize: 80,
            fontWeight: 700
          })}>
            <span className='text-3xl font-bold'>Add a Heading</span>
          </Button>
          <Button className='w-full h-16' variant='outline' size='lg' onClick={() => editor?.addText("Subheading", {
            fontSize: 60,
            fontWeight: 600
          })}>
            <span className='text-lg font-semibold'>Add a Subheading</span>
          </Button>
          <Button className='w-full h-16' variant='outline' size='lg' onClick={() => editor?.addText("Body Text", {
            fontSize: 32,
            fontWeight: 400
          })}>
            Add Body Text
          </Button>
        </div>
      </ScrollArea>
    </ToolSidebarWrapper>
  );
};
