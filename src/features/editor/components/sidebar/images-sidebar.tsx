import { type ActiveTool, type Editor } from "@/features/editor/types";
import { ToolSidebarWrapper } from "@/features/editor/components/sidebar/tool-sidebar-wrapper";
import Image from "next/image";

import { useGetImages } from "@/features/images/api/use-get-images";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangleIcon, LoaderIcon } from "lucide-react";
import Link from "next/link";

interface ImageSidebarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: ImageSidebarProps) => {
	const isOpen = activeTool === "images";

	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<ToolSidebarWrapper
			isOpen={isOpen}
			onClose={onClose}
			title='Images'
			description='Manage your image uploads.'
		>
			{isOpen && <ImagesArea editor={editor!} />}
		</ToolSidebarWrapper>
	);
};

const ImagesArea = ({ editor }: { editor: Editor }) => {
	const { data, isLoading, isError } = useGetImages();

	return (
		<>
			{isLoading && (
				<div className='flex items-center justify-center flex-1'>
					<LoaderIcon className='size-5 text-muted-foreground animate-spin' />
				</div>
			)}
			{isError && (
				<div className='flex flex-col gap-y-2 items-center justify-center flex-1'>
					<AlertTriangleIcon className='size-5 text-destructive' />
					<p className='text-muted-foreground text-xs'>
						Failed to fetch images: {isError}
					</p>
				</div>
			)}
			<ScrollArea className='overflow-auto'>
				<div className='p-4'>
					<div className='grid grid-cols-2 gap-2'>
						{data &&
							data.map((image) => {
								return (
									<button
										key={image.id}
										className='relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border'
										onClick={() => {
											editor?.addImage(image.urls.regular);
										}}
									>
										<Image
											src={image.urls.small}
											alt={
												(image as { alt_description?: string | null })
													.alt_description ?? "Image"
											}
											fill
											sizes='(max-width: 768px) 100vw, 50vw'
											className='object-cover'
										/>
										<Link
											href={image.links.html}
											target='_blank'
											className='opacity-0 group-hover:opacity-100 transition duration-200 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/80 text-left'
										>
											{image.user.name}
										</Link>
									</button>
								);
							})}
					</div>
				</div>
			</ScrollArea>
		</>
	);
};
