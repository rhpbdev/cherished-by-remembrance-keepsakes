interface ToolSidebarHeaderProps {
  title: string;
  description?: string;
}

export const ToolSidebarHeader = ({
  title,
  description,
}: ToolSidebarHeaderProps) => {
  return (
    <div className='py-2 px-4 border-b h-14'>
      <p className='text-md font-semibold'>{title}</p>
      {description && (
        <p className='text-xs text-muted-foreground'>{description}</p>
      )}
    </div>
  );
};
