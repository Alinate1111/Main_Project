// Category.tsx
import React from "react";

interface CategoryProps {
  categoryList: string[];
  
  selectedCategory: string | null;
  onSelect: (category: string) => void;
}

export const Category: React.FC<CategoryProps> = ({
  categoryList,
  selectedCategory,
  onSelect,
}) => {
  return (

    <div className="bg-white rounded-xl shadow-sm p-6">

      <h1 style={{fontSize: "30px",textAlign: "center" }}>카테고리</h1>
      <hr></hr>

    
      {categoryList.map((category, i) => (
        <div
          key={i}
          onClick={() => onSelect(category)}
          style={{
            textAlign: "center",    
            cursor: "pointer",
            padding: "10px",
            backgroundColor: selectedCategory === category ? "#e0e0e0" : "#fff",
            fontWeight: selectedCategory === category ? "bold" : "normal",
          }}
        >
          {category}
        </div>
      ))}
      <div>카테고리1</div>
      <div>카테고리2</div>
      <div>카테고리3</div>
    </div>
  );
};