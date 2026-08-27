import type { LucideIcon } from "lucide-react";
// import type {IconType} from 'react-icons';

import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

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
    <Button
      variant="outline"
      onClick={onClick}
      className='aspect-square border rounded-md p-5 w-full h-full hover:border-purple-500 transition-all duration-300'
      title='Shape Tool'
    >
      <Icon className={cn("size-10", iconClassName)} />
    </Button>
  );
};
