import { useEffect, useMemo, useState } from "react";

import {
	type ActiveTool,
	type Editor,
} from "@/features/editor/types";
import { ToolSidebarWrapper } from "@/features/editor/components/sidebar/tool-sidebar-wrapper";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

interface OpacitySidebarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const OpacitySidebar = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: OpacitySidebarProps) => {
	const initialValue = editor?.getActiveOpacity() || 1;
	const selectedObject = useMemo(() => editor?.selectedObjects[0], [editor?.selectedObjects])
	const [opacity, setOpacity] = useState<number>(initialValue);

	useEffect(() => {
		if (selectedObject) {
			setOpacity(selectedObject.get("opacity") || 1);
		}
	}, [selectedObject]);

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const onChange = (value: number) => {
		editor?.changeOpacity(value);
		setOpacity(value);
	};

	return (
		<ToolSidebarWrapper
			isOpen={activeTool === "opacity"}
			onClose={onClose}
			title='Opacity'
			description='Change the opacity of the selected object.'
		>
			<ScrollArea>
				<div className='p-4 space-y-6 border-b'>
					<Slider
						value={[opacity]}
						onValueChange={(values) => onChange(values[0])}
						max={1}
						min={0}
						step={0.01}
					></Slider>
				</div>
			</ScrollArea>
		</ToolSidebarWrapper>
	);
};
