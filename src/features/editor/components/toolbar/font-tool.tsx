import { type ActiveTool, type Editor } from "@/features/editor/types";
import { ToolSidebarWrapper } from "@/features/editor/components/sidebar/tool-sidebar-wrapper";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fonts } from "@/features/editor/constants";

interface FontToolProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FontTool = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: FontToolProps) => {
	const currentFont = editor?.getActiveFontFamily() || "";

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const onChangeFont = (fontValue: string) => {
		editor?.changeFontFamily(fontValue);
	};

	return (
		<Select onValueChange={(fontValue) => onChangeFont(fontValue)}>
			<SelectTrigger
				className='w-32 truncate'
				onClick={() => onChangeActiveTool("font")}
			>
				<SelectValue
					placeholder={currentFont ?? "Select a font"}
					defaultValue={currentFont}
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
		// <ToolSidebarWrapper
		// 	isOpen={activeTool === "font"}
		// 	onClose={onClose}
		// 	title='Font'
		// 	description='Change the font of your text.'
		// >
		// 	<ScrollArea>
		// 		<div className='p-4 space-y-6 border-b'>
		// 			<Button
		// 				className='w-full h-16'
		// 				variant='outline'
		// 				size='lg'
		// 				onClick={() =>
		// 					editor?.addText("Heading", {
		// 						fontSize: 80,
		// 						fontWeight: 700,
		// 					})
		// 				}
		// 			>
		// 				<span className='text-3xl font-bold'>Add a Heading</span>
		// 			</Button>
		// 		</div>
		// 	</ScrollArea>
		// </ToolSidebarWrapper>
	);
};
