import { type ActiveTool, type Editor } from '@/features/editor/types';
import { ToolSidebarWrapper } from '@/features/editor/components/sidebar/tool-sidebar-wrapper';
import Image from 'next/image';

import { useGetImages } from '@/features/images/api/use-get-images';

import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangleIcon, LoaderIcon } from 'lucide-react';
import Link from 'next/link';

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
  const isOpen = activeTool === 'images';

  const onClose = () => {
    onChangeActiveTool('select');
  };

  return (
    <ToolSidebarWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Images"
      description="Manage your image uploads."
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
        <div className="flex flex-1 items-center justify-center">
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {isError && (
        <div className="flex flex-1 flex-col items-center justify-center gap-y-2">
          <AlertTriangleIcon className="size-5 text-destructive" />
          <p className="text-xs text-muted-foreground">
            Failed to fetch images: {isError}
          </p>
        </div>
      )}
      <ScrollArea className="overflow-auto">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            {data &&
              data.map((image) => {
                return (
                  <button
                    key={image.id}
                    className="group relative h-[100px] w-full overflow-hidden rounded-sm border bg-muted transition hover:opacity-75"
                    onClick={() => {
                      editor?.addImage(image.urls.regular);
                    }}
                  >
                    <Image
                      src={image.urls.small}
                      alt={
                        (image as { alt_description?: string | null })
                          .alt_description ?? 'Image'
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <Link
                      href={image.links.html}
                      target="_blank"
                      className="absolute bottom-0 left-0 w-full truncate bg-black/80 p-1 text-left text-[10px] text-white opacity-0 transition duration-200 group-hover:opacity-100 hover:underline"
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
