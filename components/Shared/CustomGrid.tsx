import React, { ReactNode } from "react";

interface CustomGridProps {
  children: ReactNode;
  columns?: number;
}

const CustomGrid: React.FC<CustomGridProps> = ({ children, columns = 1 }) => {
  const gridClass = `grid grid-cols-1 md:grid-cols-${columns} gap-4`;

  return <div className={gridClass}>{children}</div>;
};

export default CustomGrid;
