interface ToolSidebarHeaderProps {
  title: string;
  description?: string;
}

export const ToolSidebarHeader = ({
  title,
  description,
}: ToolSidebarHeaderProps) => {
  return (
    <div className="h-14 border-b px-4 py-2">
      <p className="text-md font-semibold">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
