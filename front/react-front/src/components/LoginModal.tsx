import React, { useState } from "react";
import "../styles/LoginModal.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <section className={`container forms ${showSignup ? 'show-signup' : ''}`}>
        {/* Login Form */}
        <div className="form login">
          <div className="form-content">
            <header>Login</header>
            <form action="#">
              <div className="field input-field">
                <input type="email" placeholder="Email" className="input" />
              </div>

              <div className="field input-field">
                <input
                  type={showPassword['login'] ? "text" : "password"}
                  placeholder="Password"
                  className="password"
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
                <button type="button">Login</button>
              </div>
            </form>

            <div className="form-link">
              <span>Don't have an account? <a href="#" className="link signup-link" onClick={(e) => { e.preventDefault(); setShowSignup(true); }}>Signup</a></span>
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

        {/* Signup Form */}
        <div className="form signup">
          <div className="form-content">
            <header>Signup</header>
            <form action="#">
              <div className="field input-field">
                <input type="email" placeholder="Email" className="input" />
              </div>

              <div className="field input-field">
                <input
                  type={showPassword['signup1'] ? "text" : "password"}
                  placeholder="Create password"
                  className="password"
                />
                <i
                  className={`bx ${showPassword['signup1'] ? 'bx-show' : 'bx-hide'} eye-icon`}
                  onClick={() => togglePasswordVisibility('signup1')}
                ></i>
              </div>

              <div className="field input-field">
                <input
                  type={showPassword['signup2'] ? "text" : "password"}
                  placeholder="Confirm password"
                  className="password"
                />
                <i
                  className={`bx ${showPassword['signup2'] ? 'bx-show' : 'bx-hide'} eye-icon`}
                  onClick={() => togglePasswordVisibility('signup2')}
                ></i>
              </div>

              <div className="field button-field">
                <button type="button">Signup</button>
              </div>
            </form>

            <div className="form-link">
              <span>Already have an account? <a href="#" className="link login-link" onClick={(e) => { e.preventDefault(); setShowSignup(false); }}>Login</a></span>
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

        {/* Close button */}
        <button className="close-modal" onClick={onClose}>
          <i className='bx bx-x'></i>
        </button>
      </section>
    </div>
  );
};
