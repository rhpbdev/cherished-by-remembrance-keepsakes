import { RgbaStringColorPicker } from "react-colorful";
import { COLORS } from "../../types";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const colorMap = COLORS;

  return (
    <>
      <RgbaStringColorPicker
        color={value}
        onChange={(color) => onChange(color)}
        onChangeEnd={() => onChange(value)}
      />
      <div className='mt-4 flex flex-wrap gap-2'>
        {colorMap.map((color) => (
          <button
            key={color.value}
            className='rounded-xs size-6 border'
            style={{ background: color.value, cursor: "pointer" }}
            title='Color Picker'
            onClick={() => onChange(color.value)}
          />
        ))}
      </div>
    </>
  );
};
