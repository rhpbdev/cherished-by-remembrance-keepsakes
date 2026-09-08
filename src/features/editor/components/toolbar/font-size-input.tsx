import { MinusIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const FontSizeInput = ({ value, onChange }: FontSizeInputProps) => {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(value - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange(value);
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={decrement}
        variant="outline"
        className="rounded-r-none border-r-0 bg-transparent p-2"
        size="icon"
      >
        <MinusIcon className="size-4" />
      </Button>
      <Input
        type="number"
        onChange={handleChange}
        value={value}
        className="w-[50px] [appearance:textfield] rounded-none border-x-0 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        max={999}
        min={1}
      />
      <Button
        onClick={increment}
        variant="outline"
        className="rounded-l-none border-l-0 bg-transparent p-2"
        size="icon"
      >
        <PlusIcon className="size-4" />
      </Button>
    </div>
  );
};
