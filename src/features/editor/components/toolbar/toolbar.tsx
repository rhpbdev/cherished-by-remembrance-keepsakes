import { useState } from "react";

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
import { FaBold } from "react-icons/fa";
import { isTextType } from "@/features/editor/utils";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FONT_WEIGHT, fonts } from "@/features/editor/constants";

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
	const initialFillColor = editor?.getActiveFillColor();
	const initialStrokeColor = editor?.getActiveStrokeColor();
    const initialFontFamily = editor?.getActiveFontFamily();
    const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;

    const [properties, setProperties] = useState({
        fillColor: initialFillColor,
        strokeColor: initialStrokeColor,
        fontWeight: initialFontWeight,
        fontFamily: initialFontFamily,
    });

	const selectedObjectType = editor?.selectedObjects[0]?.type;

	const isText = isTextType(selectedObjectType);

    const toggleBold = () => {
        const selectedObject = editor?.selectedObjects[0];

        if (!selectedObject) return;

        const newValue = properties.fontWeight > 500 ? 500 : 700;

        editor?.changeFontWeight(newValue);
        setProperties((current) => ({
            ...current,
            fontWeight: newValue,
        }));
    };


    const onChangeFont = (fontValue: string) => {
        editor?.changeFontFamily(fontValue);
    };

	if (editor?.selectedObjects.length === 0) {
		return (
			<div className='shrink-0 h-14 border-b border-transparent bg-transparent w-full flex items-center overflow-x-auto z-49 p-2 gap-x-2' />
		);
	}


	return (
		<div className='shrink-0 h-14 border-b bg-white w-full flex items-center overflow-x-auto z-49 p-2 gap-x-2'>
			{isText && (
				<div className='flex items-center h-full justify-center'>
					{/* <Button
                                onClick={() => onChangeActiveTool("font")}
                                size='icon'
                                variant='outline'
                                className={cn(
                                    "w-auto px-2 text-xs",
                                    activeTool === "font" && "bg-muted",
                                    )}
                                    >
                                    <div className='max-w-[100px] truncate'>Arial</div>
                                    <ChevronDownIcon className='size-4 ml-2 shrink-0' />
                                    </Button> */}
					{fonts && (
						<Select onValueChange={(fontValue) => onChangeFont(fontValue)}>
							<SelectTrigger className='w-32 truncate'>
								<SelectValue
									placeholder={initialFontFamily ?? "Select a font"}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{fonts.map((font) => (
										<SelectItem key={font.name} value={font.value}>
											{font.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					)}
				</div>
			)}
			{isText && (
				<div className='flex items-center h-full justify-center'>
					<Hint label='Bold' side='bottom' sideOffset={5}>
						<Button
							onClick={toggleBold}
							size='icon'
							variant='ghost'
                            className={cn(properties.fontWeight > 500 && "bg-muted")}
						>
							<FaBold className='size-5' />
						</Button>
					</Hint>
				</div>
			)}
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
									typeof properties.fillColor === "string" ? properties.fillColor : "#000000",
							}}
						/>
					</Button>
				</Hint>
			</div>
			{!isText && (
				<>
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
											typeof properties.strokeColor === "string" ? properties.strokeColor : "#000000",
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
				</>
			)}
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
