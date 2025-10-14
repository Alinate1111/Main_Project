import React, { useState } from "react";

export const Toplogin: React.FC = () => {
  const [showTestBtn, setShowTestBtn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuList = ["홈", "이력 확인", "로그아웃"];

  const handleLoginClick = () => {
    alert("로그인 확인");
    setShowTestBtn(true);
  };

  const handleMenuClick = async (item: string) => {
    setShowMenu(false);
    if (item === "이력 확인") {
      try {
        const response = await fetch("/beforeInfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ /* 필요한 데이터 넣기 */ }),
        });
        if (!response.ok) throw new Error("이력 확인 요청 실패");
        const data = await response.json();
        console.log("이력 확인 응답:", data);
        // TODO: 받은 데이터를 활용해서 필요한 UI 처리 추가
        } catch (error) {
          console.error(error);
      }
    } else {
      alert(`${item} 클릭됨`);
    }
  };

  return (
    <div className="bg-blue-100 border border-blue-100 rounded-md shadow-sm flex justify-end relative">
      <div className="relative inline-block bg-white rounded-md shadow px-3 py-3 text-right">
        {!showTestBtn && (
          <button className="text-md" onClick={handleLoginClick}>
            로그인
          </button>
        )}

        {showTestBtn && (
          <div
            className="relative inline-block"
            onMouseEnter={() => setShowMenu(true)}
          >
            <button>테스트</button>

            {showMenu && (
              <ul
                className="text-left absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10 list-none p-2 space-y-1"
                onMouseLeave={() => setShowMenu(false)}
              >
                {menuList.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-gray-700 hover:bg-blue-100 cursor-pointer px-2 py-1 rounded"
                    onClick={() => handleMenuClick(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
