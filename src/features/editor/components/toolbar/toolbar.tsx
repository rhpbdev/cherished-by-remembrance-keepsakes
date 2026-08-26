import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
    FILL_COLOR,
	type ActiveTool,
	type Editor,
} from "@/features/editor/types";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { TbFocusCentered, TbStrokeStraight } from "react-icons/tb";
import { RxTransparencyGrid } from "react-icons/rx";

interface ToolbarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Toolbar = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: ToolbarProps) => {
	const fillColor = editor?.getActiveFillColor() || FILL_COLOR;
	const strokeColor = editor?.getActiveStrokeColor() || FILL_COLOR;

	if (editor?.selectedObjects.length === 0) {
		return (
			<div className='shrink-0 h-14 border-b border-transparent bg-transparent w-full flex items-center overflow-x-auto z-49 p-2 gap-x-2' />
		);
	}

	return (
		<div className='shrink-0 h-14 border-b bg-white w-full flex items-center overflow-x-auto z-49 p-2 gap-x-2'>
			<div className='flex items-center h-full justify-center'>
				<Hint label='Fill Color' side='bottom' sideOffset={5}>
					<Button
						onClick={() => onChangeActiveTool("fill")}
						size='icon'
						variant='ghost'
						className={cn(activeTool === "fill" && "bg-muted")}
					>
						<div
							className='rounded-sm size-5 border'
							style={{
								backgroundColor:
									typeof fillColor === "string" ? fillColor : "#000000",
							}}
						/>
					</Button>
				</Hint>
			</div>
			<div className='flex items-center h-full justify-center'>
				<Hint label='Stroke Color' side='bottom' sideOffset={5}>
					<Button
						onClick={() => onChangeActiveTool("stroke-color")}
						size='icon'
						variant='ghost'
						className={cn(activeTool === "stroke-color" && "bg-muted")}
					>
						<div
							className='rounded-sm size-5 border-3 bg-white'
							style={{
								borderColor:
									typeof strokeColor === "string" ? strokeColor : "#000000",
							}}
						/>
					</Button>
				</Hint>
			</div>
			<div className='flex items-center h-full justify-center'>
				<Hint label='Stroke Width' side='bottom' sideOffset={5}>
					<Button
						onClick={() => onChangeActiveTool("stroke-width")}
						size='icon'
						variant='ghost'
						className={cn(activeTool === "stroke-width" && "bg-muted")}
					>
						<TbStrokeStraight className='size-6' />
					</Button>
				</Hint>
			</div>
			<div className='flex items-center h-full justify-center'>
				<Hint label='Bring Forward' side='bottom' sideOffset={5}>
					<Button
						onClick={() => editor?.bringForward()}
						size='icon'
						variant='ghost'
					>
						<ArrowUpIcon className='size-5' />
					</Button>
				</Hint>
			</div>
			<div className='flex items-center h-full justify-center'>
				<Hint label='Send Backwards' side='bottom' sideOffset={5}>
					<Button
						onClick={() => editor?.sendBackward()}
						size='icon'
						variant='ghost'
					>
						<ArrowDownIcon className='size-5' />
					</Button>
				</Hint>
			</div>
			<div className='flex items-center h-full justify-center'>
				<Hint label='Center Object' side='bottom' sideOffset={5}>
					<Button
						onClick={() => editor?.centerFabricObject()}
						size='icon'
						variant='ghost'
					>
						<TbFocusCentered className='size-5' />
					</Button>
				</Hint>
			</div>
			<div className='flex items-center h-full justify-center'>
				<Hint label='Opacity' side='bottom' sideOffset={5}>
					<Button
						onClick={() => onChangeActiveTool("opacity")}
						size='icon'
						variant='ghost'
						className={cn(activeTool === "opacity" && "bg-muted")}
					>
						<RxTransparencyGrid className='size-5' />
					</Button>
				</Hint>
			</div>
		</div>
	);
};
