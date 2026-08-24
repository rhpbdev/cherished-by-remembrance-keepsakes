"use client";

import {
  ChevronDownIcon,
  FileIcon,
  MousePointerClickIcon,
  Undo2Icon,
  Redo2Icon,
  CloudCheckIcon,
  DownloadIcon,
} from "lucide-react";

import { Logo } from "@/features/editor/components/logo";
import type { ActiveTool } from "@/features/editor/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavbarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Navbar = ({ activeTool, onChangeActiveTool }: NavbarProps) => {
  return (
    <nav className='w-full flex items-center p-2 sm:p-4 lg:p-6 h-[68px] gap-x-2 lg:gap-x-8 border-b lg:pl-[24px]'>
      <Logo />
      <div className='w-full flex items-center gap-x-1 h-full'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              File <ChevronDownIcon className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='min-w-60'>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => console.log("New File")} // TODO: Implement New File functionality
                className='flex items-center gap-x-2'
              >
                <FileIcon />
                New File
                {/* <div>
                <p>New File</p>
                <p className='text-[10px] text-muted-foreground'>
                  Create a new file
                </p>
              </div> */}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        More options
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>Calendly</DropdownMenuItem>
                          <DropdownMenuItem>Slack</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Webhook</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Advanced...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>
                New Team
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='hidden md:flex items-center gap-x-1'>
          <Separator orientation='vertical' className='mx-2' />
          <Hint label='Select' side='bottom'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onChangeActiveTool("select")}
              className={cn(activeTool === "select" && "bg-gray-100")}
            >
              <MousePointerClickIcon className='size-4' />
            </Button>
          </Hint>
          <Hint label='Undo' side='bottom'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {}} // TODO: Add functionality for this button
              className='' // TODO: Add dynamic classes for active state, etc.
            >
              <Undo2Icon className='size-4' />
            </Button>
          </Hint>
          <Hint label='Redo' side='bottom'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {}} // TODO: Add functionality for this button
              className='' // TODO: Add dynamic classes for active state, etc.
            >
              <Redo2Icon className='size-4' />
            </Button>
          </Hint>
          <Separator orientation='vertical' className='mx-2' />
          <div className='flex items-center gap-x-2'>
            <CloudCheckIcon className='size-5 text-muted-foreground' />
            <div className='text-xs text-muted-foreground'>Saved</div>
          </div>
        </div>
        <div className='ml-auto flex items-center gap-x-4'>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                Export <DownloadIcon className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-70'>
              <DropdownMenuItem
                onClick={() => {}} // TODO: Implement New File functionality
                className='flex items-center gap-x-2'
              >
                <FileIcon className='size-7' />
                <div>
                  <p>Export as PNG</p>
                  <p className='text-[10px] text-muted-foreground'>
                    Best for transparent images
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* TODO: Add user button component */}
        </div>
      </div>
    </nav>
  );
};
