import React, { ReactNode } from "react";

interface CustomGridProps {
  children: ReactNode;
  columns?: number;
  customClasses?: string;
}

const CustomGrid: React.FC<CustomGridProps> = ({
  children,
  columns = 1,
  customClasses,
}) => {
  const gridClass = `grid grid-cols-1 md:grid-cols-${columns} gap-4 ${customClasses}`;

  return <div className={gridClass}>{children}</div>;
};

export default CustomGrid;
