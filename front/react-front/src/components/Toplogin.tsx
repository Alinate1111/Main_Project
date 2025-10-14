
import React from "react";

interface loginProps {
}

export const Toplogin: React.FC<loginProps> = ({

}) => {
  return (
    
      
      <div className="bg-blue-100 border border-blue-100 rounded-md shadow-sm flex justify-end">
        <div className="bg-white rounded-md  shadow max-w-[10] px-10 py-2 ">
          <button 
          className="text-xl"
          onClick={() => {
            alert('로그인 버튼 클릭!');
            }}>
            로그인
          </button>
        </div>
        
      </div>

  );
};
