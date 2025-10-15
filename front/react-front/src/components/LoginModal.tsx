import React, { useState } from "react";
import "../styles/LoginModal.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loginResult, setLoginResult] = useState<string>(""); // ✅ 에러 메시지만 사용

  if (!isOpen) return null;

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLogin = async () => {
    setLoginResult("");

    if (!id || !password) {
      setLoginResult("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  // ✅ 로그인 요청에만 세션 쿠키 포함
        body: JSON.stringify({ id, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        setLoginResult("로그인 실패: " + error.detail);
        return;
      }

      const data = await response.json();

      console.log("✅ 로그인 성공:", data);

      onClose();

    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      setLoginResult("서버 오류 또는 네트워크 문제");
    }
  };


  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <section className={`container forms ${showSignup ? 'show-signup' : ''}`}>
        {/* Login Form */}
        <div className="form login">
          <div className="form-content">
            <header>Login</header>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="field input-field">
                <input
                  type="text"
                  placeholder="ID"
                  className="input"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>

              <div className="field input-field">
                <input
                  type={showPassword['login'] ? "text" : "password"}
                  placeholder="Password"
                  className="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i
                  className={`bx ${showPassword['login'] ? 'bx-show' : 'bx-hide'} eye-icon`}
                  onClick={() => togglePasswordVisibility('login')}
                ></i>
              </div>

              <div className="form-link">
                <a href="#" className="forgot-pass">Forgot password?</a>
              </div>

              <div className="field button-field">
                <button type="button" onClick={handleLogin}>Login</button>
              </div>
            </form>

            {loginResult && <p style={{ color: "red", marginTop: "10px" }}>{loginResult}</p>}

            <div className="form-link">
              <span>Don't have an account?
                <a href="#" className="link signup-link" onClick={(e) => { e.preventDefault(); setShowSignup(true); }}> Signup</a>
              </span>
            </div>
          </div>

          <div className="line"></div>

          <div className="media-options">
            <a href="#" className="field facebook">
              <i className='bx bxl-facebook facebook-icon'></i>
              <span>Login with Facebook</span>
            </a>
          </div>

          <div className="media-options">
            <a href="#" className="field google">
              <img src="/images/google.png" alt="" className="google-img" />
              <span>Login with Google</span>
            </a>
          </div>
        </div>

        {/* Signup Form - 생략 가능 */}
        <div className="form signup"> </div>

        <button className="close-modal" onClick={onClose}>
          <i className='bx bx-x'></i>
        </button>
      </section>
    </div>
  );
};
