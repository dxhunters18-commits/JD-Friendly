import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./auth.css";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;

function App() {const [showAuth, setShowAuth] = useState(false);
  

    const [serverStatus, setServerStatus] = useState("Checking...");

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Server response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        setServerStatus(data.success ? "Backend Connected" : "Backend Error");
      })
      .catch(() => {
        setServerStatus("Backend Offline");
      });
  }, []);

  const handleSignup = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully! Please check your email to confirm your account.");
  };

  if (showAuth) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome to JD Friendly</h2>
        <p>Sign in or create your account.</p>
        <form className="auth-form" onSubmit={handleSignup}>
          <label>
            Email
            <input name="email" type="email" placeholder="Enter your email" />
          </label>

          <label>
            Password
            <input name="password" type="password" placeholder="Enter your password" />
          </label>

          <button type="submit" className="auth-submit">
            Continue
          </button>
        </form>

        <div className="auth-switch">
          <button type="button" onClick={() => setShowAuth(false)}>
            ← Back to JD Friendly
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <header className="navbar">
        <div className="brand">
          <div className="brand-mark">JD</div>

          <div>
            <h1>JD Friendly</h1>
            <span>Connect • Share • Play</span>
          </div>
        </div>

        <button className="login-button" onClick={() => setShowAuth(true)}>
  Log in
</button>
      </header>

      <main className="hero">
        <section className="hero-content">
          <div className="status-pill">
            <span className="status-dot"></span>
            Your world. Your friends. One place.
          </div>

          <h2>
            Stay connected
            <br />
            <span>with your people.</span>
          </h2>

          <p>
            Chat with friends, share photos, discover people around the world,
            play together, and enjoy music — all inside JD Friendly.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={() => setShowAuth(true)}>
  Create account
</button>
            <button className="secondary-button">Explore JD Friendly</button>
          </div>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <div>
                <strong>Real-time chat</strong>
                <span>Talk with your friends instantly.</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <div>
                <strong>Connect globally</strong>
                <span>Friends across cities and countries.</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <div>
                <strong>Play together</strong>
                <span>Games and shared experiences.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="preview">
          <div className="preview-window">
            <div className="window-top">
              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="window-title">JD Friendly</div>

              <div className="online-badge">
                <span></span>
                Online
              </div>
            </div>

            <div className="chat-preview">
              <div className="chat-sidebar">
                <div className="mini-profile">
                  <div className="avatar">P</div>

                  <div>
                    <strong>Prasanna</strong>
                    <span>My account</span>
                  </div>
                </div>

                <div className="sidebar-label">Messages</div>

                <div className="chat-user active">
                  <div className="small-avatar">A</div>
                  <div>
                    <strong>Arjun</strong>
                    <span>Hey! 👋</span>
                  </div>
                  <b>2</b>
                </div>

                <div className="chat-user">
                  <div className="small-avatar purple">S</div>
                  <div>
                    <strong>Shailu</strong>
                    <span>Photo sent</span>
                  </div>
                </div>

                <div className="chat-user">
                  <div className="small-avatar blue">R</div>
                  <div>
                    <strong>Rahul</strong>
                    <span>Let's play!</span>
                  </div>
                </div>
              </div>

              <div className="chat-main">
                <div className="chat-header">
                  <div>
                    <strong>Arjun</strong>
                    <span>● Active now</span>
                  </div>

                  <div className="chat-actions">
                    <button>📞</button>
                    <button>🎥</button>
                    <button>⋯</button>
                  </div>
                </div>

                <div className="messages">
                  <div className="message received">
                    Hey Prasanna! 👋
                  </div>

                  <div className="message received">
                    Ready to try JD Friendly?
                  </div>

                  <div className="message sent">
                    Absolutely! 🚀
                  </div>

                  <div className="message sent">
                    This is going to be amazing.
                  </div>
                </div>

                <div className="message-box">
                  <span>Write a message...</span>
                  <button>➤</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 JD Friendly</span>
        <span>Made to bring friends closer.</span>
      </footer>
    </div>
  );
}

export default App;
