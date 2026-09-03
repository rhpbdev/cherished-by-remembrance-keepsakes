import { useEffect, useMemo, useState } from "react";
import { type ActiveTool, type Editor } from "@/features/editor/types";
import { ToolSidebarWrapper } from "@/features/editor/components/sidebar/tool-sidebar-wrapper";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "../tools/color-picker";

interface SettingsSidebarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const SettingsSidebar = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: SettingsSidebarProps) => {
	const workspace = editor?.getWorkspace();

	const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
	const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
	const initialBackground = useMemo(
		() => workspace?.fill ?? "#fff",
		[workspace],
	) as string;

	const [width, setWidth] = useState(initialWidth);
	const [height, setHeight] = useState(initialHeight);
	const [background, setBackground] = useState(initialBackground);

	useEffect(() => {
		setWidth(initialWidth);
		setHeight(initialHeight);
		setBackground(initialBackground);
	}, [initialWidth, initialHeight, initialBackground]);

	const changeWidth = (value: string) => setWidth(value);
	const changeHeight = (value: string) => setHeight(value);
	const changeBackground = (value: string) => {
		setBackground(value);
		editor?.changeBackground(value);
	};

	const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		editor?.changeSize({
			width: parseInt(width, 10),
			height: parseInt(height, 10),
		});
	};

	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<ToolSidebarWrapper
			isOpen={activeTool === "settings"}
			onClose={onClose}
			title='Settings'
			description='Change the settings of the canvas.'
		>
			<ScrollArea>
				<form className='space-y-4 p-4' onSubmit={onSubmit}>
					<div className='p-4 space-y-6'>
						<Label>
							Height
							<Input
								placeholder='Height'
								value={height}
								type='number'
								onChange={(e) => changeHeight(e.target.value)}
							/>
						</Label>
						<Label>
							Width
							<Input
								placeholder='Width'
								value={width}
								type='number'
								onChange={(e) => changeWidth(e.target.value)}
							/>
						</Label>
					</div>
					<Button type='submit' className='w-full'>
						Resize
					</Button>
				</form>
				<div className='p-4'>
					<ColorPicker value={background} onChange={changeBackground} />
				</div>
			</ScrollArea>
		</ToolSidebarWrapper>
	);
};
