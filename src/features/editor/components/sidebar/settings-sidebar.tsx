import { useState } from "react";
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
	const isOpen = activeTool === "settings";

	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<ToolSidebarWrapper
			isOpen={isOpen}
			onClose={onClose}
			title='Settings'
			description='Change the settings of the canvas.'
		>
			{/* The form is mounted only while the panel is open, so its inputs seed
			    themselves from the live workspace on every open. That replaces the
			    effect that used to copy the workspace into state on each change. */}
			{isOpen && editor && <SettingsForm editor={editor} />}
		</ToolSidebarWrapper>
	);
};

const SettingsForm = ({ editor }: { editor: Editor }) => {
	const workspace = editor.getWorkspace();

	// Lazy initializers: read once, on mount. The canvas owns these values from
	// here on; the inputs are just a draft the user edits until they submit.
	const [width, setWidth] = useState(() => `${workspace?.width ?? 0}`);
	const [height, setHeight] = useState(() => `${workspace?.height ?? 0}`);
	const [background, setBackground] = useState(
		() => (workspace?.fill as string) ?? "#fff",
	);

	const changeWidth = (value: string) => setWidth(value);
	const changeHeight = (value: string) => setHeight(value);
	const changeBackground = (value: string) => {
		setBackground(value);
		editor.changeBackground(value);
	};

	const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		editor.changeSize({
			width: parseInt(width, 10),
			height: parseInt(height, 10),
		});
	};

	return (
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
	);
};
