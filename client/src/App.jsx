import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./auth.css";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const sections = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "messages", icon: "◈", label: "Messages" },
  { id: "photos", icon: "▣", label: "Photos" },
  { id: "games", icon: "◆", label: "Games" },
  { id: "music", icon: "♫", label: "Music" },
  { id: "connect", icon: "◎", label: "Connect" },
  { id: "profile", icon: "●", label: "Profile" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [activeSection, setActiveSection] = useState("home");
  const [serverStatus, setServerStatus] = useState("Checking...");

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((response) => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
      })
      .then((data) => {
        setServerStatus(data.success ? "Backend Connected" : "Backend Error");
      })
      .catch(() => setServerStatus("Backend Offline"));

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setUser(data.user);
    setShowAuth(false);
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

    alert(
      "Account created successfully! Please check your email to confirm your account."
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveSection("home");
  };

  const navigate = (section) => {
    setActiveSection(section);
  };

  if (showAuth) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">JD</div>

          <div className="auth-kicker">JD FRIENDLY</div>

          <h2>
            {authMode === "login" ? "Welcome back." : "Join your people."}
          </h2>

          <p>
            {authMode === "login"
              ? "Sign in and get back to your world."
              : "Create your account and start connecting."}
          </p>

          <form
            className="auth-form"
            onSubmit={
              authMode === "login" ? handleLogin : handleSignup
            }
          >
            <label>
              Email
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                minLength="6"
                required
              />
            </label>

            <button className="auth-submit" type="submit">
              {authMode === "login" ? "Enter JD Friendly" : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            {authMode === "login" ? (
              <>
                New to JD Friendly?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                >
                  Log in
                </button>
              </>
            )}
          </div>

          <button
            className="auth-back"
            type="button"
            onClick={() => setShowAuth(false)}
          >
            ← Back to JD Friendly
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="landing-page">
        <div className="landing-orb landing-orb-one" />
        <div className="landing-orb landing-orb-two" />
        <div className="landing-orb landing-orb-three" />

        <nav className="landing-nav">
          <div className="landing-brand">
            <div className="landing-logo">JD</div>
            <div>
              <strong>JD Friendly</strong>
              <span>Connect • Share • Play</span>
            </div>
          </div>

          <button
            className="landing-login"
            onClick={() => {
              setAuthMode("login");
              setShowAuth(true);
            }}
          >
            Log in
          </button>
        </nav>

        <main className="landing-content">
          <span className="hero-badge">✦ YOUR WORLD. YOUR PEOPLE.</span>

          <h1>
            Stay connected
            <br />
            <span>with your people.</span>
          </h1>

          <p>
            Chat, share, play and connect with friends across cities,
            districts, states and countries.
          </p>

          <div className="landing-actions">
            <button
              className="hero-primary"
              onClick={() => {
                setAuthMode("signup");
                setShowAuth(true);
              }}
            >
              Create your space →
            </button>

            <button
              className="hero-secondary"
              onClick={() => {
                setAuthMode("login");
                setShowAuth(true);
              }}
            >
              I already have an account
            </button>
          </div>

          <div className="feature-strip">
            <span>◈ Messages</span>
            <span>▣ Photos</span>
            <span>◆ Games</span>
            <span>♫ Music</span>
            <span>◎ Global</span>
          </div>

          <div className="server-pill">
            <i />
            {serverStatus}
          </div>
        </main>
      </div>
    );
  }

  const renderSection = () => {
    if (activeSection === "home") {
      return (
        <>
          <section className="welcome-panel">
            <span className="section-kicker">YOUR SPACE</span>
            <h1>
              Welcome back<span>.</span>
            </h1>
            <p>Your friends, conversations and moments are waiting.</p>

            <div className="quick-profile">
              <div className="quick-avatar">
                {(user.email?.[0] || "J").toUpperCase()}
              </div>
              <div>
                <small>SIGNED IN AS</small>
                <strong>{user.email}</strong>
                <em>● Online now</em>
              </div>
            </div>
          </section>

          <section className="feature-grid">
            <button
              className="feature-card feature-purple"
              onClick={() => navigate("messages")}
            >
              <span className="feature-icon">◈</span>
              <strong>Messages</strong>
              <p>Talk with your friends.</p>
              <b>Open chats →</b>
            </button>

            <button
              className="feature-card feature-pink"
              onClick={() => navigate("photos")}
            >
              <span className="feature-icon">▣</span>
              <strong>Photos</strong>
              <p>Share your favorite moments.</p>
              <b>Open photos →</b>
            </button>

            <button
              className="feature-card feature-blue"
              onClick={() => navigate("games")}
            >
              <span className="feature-icon">◆</span>
              <strong>Games</strong>
              <p>Play together.</p>
              <b>Open games →</b>
            </button>

            <button
              className="feature-card feature-orange"
              onClick={() => navigate("music")}
            >
              <span className="feature-icon">♫</span>
              <strong>Music</strong>
              <p>Listen together.</p>
              <b>Open music →</b>
            </button>
          </section>

          <section className="world-panel">
            <div>
              <span className="section-kicker">YOUR WORLD</span>
              <h2>Connect beyond borders.</h2>
              <p>
                Friends across cities, districts, states and countries.
              </p>
            </div>

            <div className="world-pills">
              <span>◎ Global</span>
              <span>✦ Instant</span>
              <span>♡ Friendly</span>
            </div>
          </section>
        </>
      );
    }

    const info = {
      messages: {
        icon: "◈",
        title: "Messages",
        text: "Your private conversations will live here.",
        action: "Start a conversation",
      },
      photos: {
        icon: "▣",
        title: "Photos",
        text: "Your shared photos and memories will live here.",
        action: "Add your first photo",
      },
      games: {
        icon: "◆",
        title: "Games",
        text: "Your multiplayer games hub is ready for the next feature.",
        action: "Explore games",
      },
      music: {
        icon: "♫",
        title: "Music",
        text: "Your shared music space is ready for the next feature.",
        action: "Open music",
      },
      connect: {
        icon: "◎",
        title: "Connect",
        text: "Find and connect with friends across your world.",
        action: "Find friends",
      },
      profile: {
        icon: "●",
        title: "Profile",
        text: "Manage your JD Friendly profile.",
        action: "Edit profile",
      },
      settings: {
        icon: "⚙",
        title: "Settings",
        text: "Your account and app settings will live here.",
        action: "Open settings",
      },
    };

    const current = info[activeSection];

    return (
      <section className="section-page">
        <div className="section-icon">{current.icon}</div>
        <span className="section-kicker">JD FRIENDLY</span>
        <h1>{current.title}</h1>
        <p>{current.text}</p>

        <button className="section-action">
          {current.action} →
        </button>

        <button
          className="section-back"
          onClick={() => navigate("home")}
        >
          ← Back home
        </button>
      </section>
    );
  };

  return (
    <div className="app-shell">
      <div className="app-glow glow-a" />
      <div className="app-glow glow-b" />
      <div className="app-glow glow-c" />

      <header className="app-topbar">
        <button
          className="app-brand"
          onClick={() => navigate("home")}
        >
          <span>JD</span>
          <div>
            <strong>JD Friendly</strong>
            <small>Connect • Share • Play</small>
          </div>
        </button>

        <div className="top-actions">
          <span className="top-status">
            <i />
            Online
          </span>

          <button
            className="top-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        {renderSection()}
      </main>

      <aside className="desktop-nav">
        {sections.map((item) => (
          <button
            key={item.id}
            className={activeSection === item.id ? "active" : ""}
            onClick={() => navigate(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>

      <nav className="mobile-nav">
        {sections.slice(0, 5).map((item) => (
          <button
            key={item.id}
            className={activeSection === item.id ? "active" : ""}
            onClick={() => navigate(item.id)}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
