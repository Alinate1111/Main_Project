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
    
    <div className="bg-white rounded-xl  shadow-sm p-3 text-center">
      
      <h1 className=" text-4xl mb-5">카테고리</h1>
      <hr></hr>
      <div className="text-2xl text-center p-5">
        <div>카테고리1</div>
        <div>카테고리2</div>
        <div>카테고리3</div>
      </div>
      
    </div>
  );
};