import { useState } from "react";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
	FILL_COLOR,
	FONT_SIZE,
	STROKE_COLOR,
	type ActiveTool,
	type Editor,
} from "@/features/editor/types";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { TbFocusCentered, TbStrokeStraight } from "react-icons/tb";
import { RxTransparencyGrid } from "react-icons/rx";
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { isTextType } from "@/features/editor/utils";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FONT_WEIGHT, fonts } from "@/features/editor/constants";
import { FontSizeInput } from './font-size-input';

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
	const initialFontStyle = editor?.getActiveFontStyle();
	const initialFontLinethrough = editor?.getActiveFontLinethrough();
	const initialFontUnderline = editor?.getActiveFontUnderline();
    const initialTextAlign = editor?.getActiveTextAlign();
    const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE; 

    const [properties, setProperties] = useState({
        fillColor: initialFillColor,
        strokeColor: initialStrokeColor,
        fontFamily: initialFontFamily,
        fontWeight: initialFontWeight,
		fontStyle: initialFontStyle,
		fontLinethrough: initialFontLinethrough,
		fontUnderline: initialFontUnderline,
        textAlign: initialTextAlign,
        fontSize: initialFontSize
    });

	const selectedObject = editor?.selectedObjects[0];
	const selectedObjectType = editor?.selectedObjects[0]?.type;

	const isText = isTextType(selectedObjectType);

    const onChangeFontSize = (value: number) => {
        if (!selectedObject) {
        return;
        }

        editor?.changeFontSize(value);
        setProperties((current) => ({
        ...current,
        fontSize: value,
        }));
    };

    const onChangeTextAlign = (value: string) => {
        if (!selectedObject) return;

        editor?.changeTextAlign(value);
        setProperties((current) => ({
            ...current,
            textAlign: value,
        }));
    };

    const toggleBold = () => {
        if (!selectedObject) return;

        const newValue = properties.fontWeight > 500 ? 500 : 700;

        editor?.changeFontWeight(newValue);
        setProperties((current) => ({
            ...current,
            fontWeight: newValue,
        }));
    };

	const toggleItalic = () => {
		if (!selectedObject) return;

		const isTalic = properties.fontStyle === "italic";
		const newValue = isTalic ? "normal" : "italic";

		editor?.changeFontStyle(newValue);
		setProperties((current) => ({
			...current,
			fontStyle: newValue
		}));
	};

	const toggleLinethrough = () => {
		if (!selectedObject) return;

		const newValue = properties.fontLinethrough ? false : true;

		editor?.changeFontLinethrough(newValue);
		setProperties((current) => ({
			...current,
			fontLinethrough: newValue
		}));
	};

	const toggleUnderline = () => {
		if (!selectedObject) return;

		const newValue = properties.fontUnderline ? false : true;

		editor?.changeFontUnderline(newValue);
		setProperties((current) => ({
			...current,
			fontUnderline: newValue
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
					{fonts && (
						<Select onValueChange={(fontValue) => onChangeFont(fontValue)}>
							<SelectTrigger className='w-32 truncate'>
								<SelectValue
									placeholder={properties.fontFamily ?? "Select a font"}
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
                    <FontSizeInput
                        value={properties.fontSize}
                        onChange={onChangeFontSize}
                    />
                </div>
            )}
			{isText && (
				<div className='flex items-center h-full justify-center'>
					<Hint label='Bold' side='bottom' sideOffset={5}>
						<Button
							onClick={toggleBold}
							size='icon'
							variant='ghost'
                            className={cn(properties.fontWeight > 500 && "bg-primary/70")}
						>
							<FaBold className='size-4' />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className='flex items-center h-full justify-center'>
					<Hint label='Italic' side='bottom' sideOffset={5}>
						<Button
							onClick={toggleItalic}
							size='icon'
							variant='ghost'
                            className={cn(properties.fontStyle === "italic" && "bg-primary/70")}
						>
							<FaItalic className='size-4' />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className='flex items-center h-full justify-center'>
					<Hint label='Linethrough' side='bottom' sideOffset={5}>
						<Button
							onClick={toggleLinethrough}
							size='icon'
							variant='ghost'
                            className={cn(properties.fontLinethrough && "bg-primary/70")}
						>
							<FaStrikethrough className='size-4' />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className='flex items-center h-full justify-center'>
					<Hint label='Underline' side='bottom' sideOffset={5}>
						<Button
							onClick={toggleUnderline}
							size='icon'
							variant='ghost'
                            className={cn(properties.fontUnderline && "bg-primary/70")}
						>
							<FaUnderline className='size-4' />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className='flex items-center h-full justify-center'>
					<Hint label='Left Align' side='bottom' sideOffset={5}>
						<Button
							onClick={() => onChangeTextAlign("left")}
							size='icon'
							variant='ghost'
                            className={cn(properties.textAlign === "left" && "bg-primary/70")}
						>
							<FaAlignLeft className='size-4' />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className='flex items-center h-full justify-center'>
					<Hint label='Center Align' side='bottom' sideOffset={5}>
						<Button
							onClick={() => onChangeTextAlign("center")}
							size='icon'
							variant='ghost'
                            className={cn(properties.textAlign === "center" && "bg-primary/70")}
						>
							<FaAlignCenter className='size-4' />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className='flex items-center h-full justify-center'>
					<Hint label='Right Align' side='bottom' sideOffset={5}>
						<Button
							onClick={() => onChangeTextAlign("right")}
							size='icon'
							variant='ghost'
                            className={cn(properties.textAlign === "right" && "bg-primary/70")}
						>
							<FaAlignRight className='size-4' />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className='flex items-center h-full justify-center'>
					<Hint label='Justify Align' side='bottom' sideOffset={5}>
						<Button
							onClick={() => onChangeTextAlign("justify")}
							size='icon'
							variant='ghost'
                            className={cn(properties.textAlign === "justify" && "bg-primary/70")}
						>
							<FaAlignJustify className='size-4' />
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
						className={cn(activeTool === "fill" && "bg-primary/70")}
					>
						<div
							className='rounded-sm size-5 border'
							style={{
								backgroundColor:
									typeof properties.fillColor === "string" ? properties.fillColor : FILL_COLOR,
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
								className={cn(activeTool === "stroke-color" && "bg-primary/70")}
							>
								<div
									className='rounded-sm size-5 border-3 bg-white'
									style={{
										borderColor:
											typeof properties.strokeColor === "string" ? properties.strokeColor : STROKE_COLOR,
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
								className={cn(activeTool === "stroke-width" && "bg-primary/70")}
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
						className="active:bg-primary/70"
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
						className="active:bg-primary/70"
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
						className="active:bg-primary/70"
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
						className={cn(activeTool === "opacity" && "bg-primary/70")}
					>
						<RxTransparencyGrid className='size-5 bg-white border border-white' />
					</Button>
				</Hint>
			</div>
		</div>
	);
};
