import {
	STROKE_DASH_ARRAY,
	STROKE_WIDTH,
	type ActiveTool,
	type Editor,
} from "@/features/editor/types";
import { ToolSidebarWrapper } from "@/features/editor/components/sidebar/tool-sidebar-wrapper";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";

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
	const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
	const typeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const onChangeStrokeWidth = (value: number) => {
		editor?.changeStrokeWidth(value);
	};

	const onChangeStrokeType = (value: number[]) => {
		editor?.changeStrokeDashArray(value);
	};

	return (
		<ToolSidebarWrapper
			isOpen={activeTool === "stroke-width"}
			onClose={onClose}
			title='Stroke Options'
			description='Change the stroke of the selected object.'
		>
			<ScrollArea>
				<div className='p-4 space-y-6 border-b'>
					<Label className='text-sm'>Stroke Width</Label>
					<Slider
						value={[widthValue]}
						onValueChange={(values) => onChangeStrokeWidth(values[0])}
					></Slider>
				</div>
				<div className='p-4 space-y-6 border-b'>
					<Label className='text-sm'>Stroke Type</Label>
					<Hint label='Solid' side='right' sideOffset={5}>
						<Button
							variant='outline'
							size='lg'
							className={cn(
								"w-full h-16 justify-start text-left px-2 py-4 border-2",
								typeValue.length === 0 && "border-purple-500",
							)}
							onClick={() => onChangeStrokeType([])}
						>
							<div className='w-full border-black rounded-full border-4' />
						</Button>
					</Hint>
					<Hint label='Dashed' side='right' sideOffset={5}>
						<Button
							variant='outline'
							size='lg'
							className={cn(
								"w-full h-16 justify-start text-left px-2 py-4 border-2",
								typeValue[0] === 5 && typeValue[1] === 5 && "border-purple-500",
							)}
							onClick={() => onChangeStrokeType([5, 5])}
						>
							<div className='w-full border-black rounded-full border-4 border-dashed' />
						</Button>
					</Hint>
				</div>
			</ScrollArea>
		</ToolSidebarWrapper>
	);
};
