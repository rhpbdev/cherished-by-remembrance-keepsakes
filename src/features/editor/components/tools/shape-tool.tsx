import type { LucideIcon } from "lucide-react";
// import type {IconType} from 'react-icons';

import { cn } from "@/lib/utils";

interface ShapeToolProps {
  onClick: () => void;
  icon: LucideIcon;
  iconClassName?: string;
}

export const ShapeTool = ({
  onClick,
  icon: Icon,
  iconClassName,
}: ShapeToolProps) => {
  return (
    <button
      onClick={onClick}
      className='aspect-square border rounded-md p-5'
      title='Shape Tool'
    >
      <Icon className={cn("h-full w-full", iconClassName)} />
    </button>
  );
};
