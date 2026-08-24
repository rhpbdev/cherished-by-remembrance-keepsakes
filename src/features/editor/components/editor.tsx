"use client";

import { Canvas } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  selectionDependentTools,
  type ActiveTool,
} from "@/features/editor/types";
import { Navbar } from "@/features/editor/components/navbar";
import { Footer } from "@/features/editor/components/footer";
import { Sidebar } from "@/features/editor/components/sidebar/sidebar";
import { MobileSidebar } from "@/features/editor/components/sidebar/mobile-sidebar";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { Toolbar } from "@/features/editor/components/toolbar/toolbar";
import { ShapeSidebar } from "@/features/editor/components/sidebar/shape-sidebar";
import { FillColorSidebar } from "@/features/editor/components/sidebar/fill-color-sidebar";
import { StrokeColorSidebar } from "./sidebar/stroke-color-sidebar";
export const Editor = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  // Put inside useCallback to prevent unnecessary re-renders of the Sidebar component when activeTool changes.
  // We will use this later inside a useEffect so we need it to be memoized.
  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool("select");
      }

      if (tool === "templates") {
        // TODO: Open templates modal
      }

      if (activeTool === "templates") {
        // TODO: Close templates modal
      }

      if (tool === "draw") {
        // TODO: Enable drawing mode
      }

      if (activeTool === "draw") {
        // TODO: Disable drawing mode
      }

      setActiveTool(tool);
    },
    [activeTool],
  );

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  // Call the useEditor hook to get access to the editor context, including the init function
  const { init, editor } = useEditor({
    clearSelectionCallback: onClearSelection,
  });

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize the Fabric.js canvas when the component mounts
  useEffect(() => {
    console.log("Initializing canvas...");
    const canvas = new Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  return (
    <div className='h-full flex flex-col'>
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
      <div className='absolute h-[calc(100%-124px)] md:h-[calc(100%-68px)] w-full top-17 flex'>
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className='bg-muted flex-1 overflow-auto relative flex flex-col'>
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          {/* overflow-hidden + min-h-0 keep the canvas from ever growing this
              container: anything the canvas spills stays clipped here instead of
              reaching <main>'s scrollbar and feeding back into the ResizeObserver. */}
          <div
            ref={containerRef}
            className='flex-1 min-h-0 overflow-hidden h-[calc(100%-124px)] bg-muted'
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
      <MobileSidebar
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
    </div>
  );
};
