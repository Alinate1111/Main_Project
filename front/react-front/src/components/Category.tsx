// Category.tsx
import React from "react";

interface CategoryProps {
  
  selectedCategory: string | null;
  onSelect: (category: string) => void;
}

export const Category: React.FC<CategoryProps> = ({
  selectedCategory,
  onSelect,
}) => {
  return (
    
    <div className="bg-white rounded-xl shadow-sm p-6">
      
      <h1 style={{fontSize: "30px",textAlign: "center" }}>카테고리</h1>
      <hr></hr>
      <div>카테고리1</div>
      <div>카테고리2</div>
      <div>카테고리3</div>
    </div>
  );
};
