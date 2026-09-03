import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/types";
import { Minimize2Icon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

interface FooterProps {
	editor: Editor | undefined;
}

export const Footer = ({ editor }: FooterProps) => {
	return (
		<footer className='h-13 border-t bg-white w-full flex items-center overflow-x-auto z-49 p-2 gap-x-1 shrink-0 px-4 flex-row-reverse'>
			<Hint label='Zoom In' side='top' sideOffset={10}>
				<Button
					onClick={() => editor?.zoomIn()}
					size='icon'
					variant='ghost'
					className='h-full'
				>
					<ZoomInIcon className='size-4' />
				</Button>
			</Hint>
			<Hint label='Zoom Out' side='top' sideOffset={10}>
				<Button
					onClick={() => editor?.zoomOut()}
					size='icon'
					variant='ghost'
					className='h-full'
				>
					<ZoomOutIcon className='size-4' />
				</Button>
			</Hint>
			<Hint label='Reset' side='top' sideOffset={10}>
				<Button
					onClick={() => editor?.autoZoom()}
					size='icon'
					variant='ghost'
					className='h-full'
				>
					<Minimize2Icon className='size-4' />
				</Button>
			</Hint>
		</footer>
	);
};
