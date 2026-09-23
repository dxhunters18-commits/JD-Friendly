import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./auth.css";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;

function App() {const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login successful!");
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowAuth(false);
    setAuthMode("login");
  };

  if (user) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-orb orb-one"></div>
        <div className="dashboard-orb orb-two"></div>
        <div className="dashboard-orb orb-three"></div>

        <nav className="dashboard-nav">
          <div className="dashboard-brand">
            <div className="dashboard-logo">JD</div>
            <div>
              <strong>JD Friendly</strong>
              <span>Connect • Share • Play</span>
            </div>
          </div>

          <button className="dashboard-logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>

        <main className="dashboard-content">
          <section className="dashboard-hero">
            <div className="hero-badge">✦ YOU'RE IN</div>

            <h1>
              Welcome to
              <span> JD Friendly</span>
            </h1>

            <p>
              Your friends. Your world. One place.
            </p>

            <div className="profile-card">
              <div className="profile-avatar">
                {(user.email?.[0] || "J").toUpperCase()}
              </div>

              <div className="profile-info">
                <span className="profile-label">SIGNED IN AS</span>
                <strong>{user.email}</strong>
                <div className="online-status">
                  <i></i>
                  Online now
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-grid">
            <button className="dashboard-card card-purple">
              <div className="card-icon">💬</div>
              <strong>Messages</strong>
              <span>Chat with your friends</span>
              <b>Open →</b>
            </button>

            <button className="dashboard-card card-pink">
              <div className="card-icon">📸</div>
              <strong>Photos</strong>
              <span>Share your moments</span>
              <b>Open →</b>
            </button>

            <button className="dashboard-card card-blue">
              <div className="card-icon">🎮</div>
              <strong>Games</strong>
              <span>Play together</span>
              <b>Open →</b>
            </button>

            <button className="dashboard-card card-orange">
              <div className="card-icon">🎵</div>
              <strong>Music</strong>
              <span>Listen together</span>
              <b>Open →</b>
            </button>
          </section>

          <section className="dashboard-connect">
            <div>
              <span className="section-kicker">YOUR WORLD</span>
              <h2>Connect beyond borders 🌍</h2>
              <p>
                Friends across cities, districts, states and countries.
              </p>
            </div>

            <div className="connection-pills">
              <span>🌍 Global</span>
              <span>⚡ Instant</span>
              <span>💜 Friendly</span>
            </div>
          </section>
        </main>
      </div>
    );
  }
  if (showAuth) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{authMode === "login" ? "Welcome Back" : "Create Your Account"}</h2>
        <p>{authMode === "login" ? "Log in to continue to JD Friendly." : "Create your JD Friendly account."}</p>
        <form className="auth-form" onSubmit={authMode === "login" ? handleLogin : handleSignup}>
          <label>
            Email
            <input name="email" type="email" placeholder="Enter your email" />
          </label>

          <label>
            Password
            <input name="password" type="password" placeholder="Enter your password" />
          </label>

          <button type="submit" className="auth-submit">
            {authMode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <div className="auth-switch">
          <button type="button" onClick={() => setShowAuth(false)}>
            â† Back to JD Friendly
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
            <span>Connect â€¢ Share â€¢ Play</span>
          </div>
        </div>

        <button className="login-button" onClick={() => { setAuthMode("login"); setShowAuth(true); }}>
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
            play together, and enjoy music â€” all inside JD Friendly.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={() => { setAuthMode("signup"); setShowAuth(true); }}>
  Create account
</button>
            <button className="secondary-button">Explore JD Friendly</button>
          </div>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">ðŸ’¬</div>
              <div>
                <strong>Real-time chat</strong>
                <span>Talk with your friends instantly.</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">ðŸŒ</div>
              <div>
                <strong>Connect globally</strong>
                <span>Friends across cities and countries.</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">ðŸŽ®</div>
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
                    <span>Hey! ðŸ‘‹</span>
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
                    <span>â— Active now</span>
                  </div>

                  <div className="chat-actions">
                    <button>ðŸ“ž</button>
                    <button>ðŸŽ¥</button>
                    <button>â‹¯</button>
                  </div>
                </div>

                <div className="messages">
                  <div className="message received">
                    Hey Prasanna! ðŸ‘‹
                  </div>

                  <div className="message received">
                    Ready to try JD Friendly?
                  </div>

                  <div className="message sent">
                    Absolutely! ðŸš€
                  </div>

                  <div className="message sent">
                    This is going to be amazing.
                  </div>
                </div>

                <div className="message-box">
                  <span>Write a message...</span>
                  <button>âž¤</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>Â© 2026 JD Friendly</span>
        <span>Made to bring friends closer.</span>
      </footer>
    </div>
  );
}

export default App;









