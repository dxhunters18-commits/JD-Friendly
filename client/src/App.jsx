import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./auth.css";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const navItems = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "messages", label: "Chats", icon: "💬" },
  { id: "photos", label: "Photos", icon: "📸" },
  { id: "games", label: "Games", icon: "🎮" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "connect", label: "Friends", icon: "👥" },
];

const demoFriends = [
  { name: "Alex", status: "Online now", color: "purple", avatar: "A" },
  { name: "Maya", status: "Active 5m ago", color: "pink", avatar: "M" },
  { name: "Daniel", status: "Online now", color: "blue", avatar: "D" },
  { name: "Sara", status: "Active 12m ago", color: "orange", avatar: "S" },
];

const demoChats = [
  {
    name: "Alex",
    message: "Hey! Are you free tonight? 👋",
    time: "2m",
    color: "purple",
    avatar: "A",
  },
  {
    name: "Maya",
    message: "That photo is amazing! 🔥",
    time: "18m",
    color: "pink",
    avatar: "M",
  },
  {
    name: "Daniel",
    message: "Let's play something 🎮",
    time: "34m",
    color: "blue",
    avatar: "D",
  },
];

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [showAuth, setShowAuth] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [serverStatus, setServerStatus] = useState("Connecting");
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    checkServer();

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

  const checkServer = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      const data = await response.json();

      if (data.success) {
        setServerStatus("Online");
      } else {
        setServerStatus("Offline");
      }
    } catch {
      setServerStatus("Offline");
    }
  };

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2500);
  };

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
    showToast("Welcome back to JD Friendly ✨");
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.session) {
      setUser(data.user);
      setShowAuth(false);
      showToast("Welcome to JD Friendly 🎉");
    } else {
      alert(
        "Your account was created. Please check your email and confirm your account before logging in."
      );
      setAuthMode("login");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActivePage("home");
    showToast("See you soon 👋");
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessage("");
    showToast("Message ready to send 💬");
  };

  const firstLetter = (
    user?.email?.charAt(0) ||
    "J"
  ).toUpperCase();

  if (showAuth) {
    return (
      <div className="jd-auth-screen">
        <div className="auth-background">
          <div className="auth-orb orb-a" />
          <div className="auth-orb orb-b" />
          <div className="auth-orb orb-c" />
        </div>

        <button
          className="auth-home-button"
          onClick={() => setShowAuth(false)}
        >
          ← Back
        </button>

        <div className="jd-auth-card">
          <div className="auth-brand">
            <div className="auth-brand-logo">JD</div>
            <div>
              <strong>JD Friendly</strong>
              <span>your people. your world.</span>
            </div>
          </div>

          <div className="auth-heading">
            <span>{authMode === "login" ? "WELCOME BACK" : "JOIN THE FAMILY"}</span>
            <h1>
              {authMode === "login"
                ? "Good to see you."
                : "Let's get connected."}
            </h1>
            <p>
              {authMode === "login"
                ? "Your friends are waiting for you."
                : "Create your space and bring your people together."}
            </p>
          </div>

          <form
            className="jd-auth-form"
            onSubmit={authMode === "login" ? handleLogin : handleSignup}
          >
            <label>
              <span>Email address</span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                minLength="6"
                required
              />
            </label>

            <button type="submit" className="jd-auth-submit">
              {authMode === "login"
                ? "Enter JD Friendly"
                : "Create my account"}
              <span>→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-switch">
            {authMode === "login" ? (
              <>
                New here?
                <button
                  onClick={() => setAuthMode("signup")}
                  type="button"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already a member?
                <button
                  onClick={() => setAuthMode("login")}
                  type="button"
                >
                  Log in
                </button>
              </>
            )}
          </div>

          <div className="auth-footer">
            <span>🔒</span>
            Your account is protected by secure authentication.
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="jd-landing">
        <div className="landing-stars" />
        <div className="landing-gradient gradient-one" />
        <div className="landing-gradient gradient-two" />
        <div className="landing-gradient gradient-three" />

        <header className="landing-header">
          <div className="landing-logo-wrap">
            <div className="landing-logo">JD</div>
            <div className="landing-brand-text">
              <strong>JD Friendly</strong>
              <span>Connect • Share • Play</span>
            </div>
          </div>

          <button
            className="landing-login-button"
            onClick={() => {
              setAuthMode("login");
              setShowAuth(true);
            }}
          >
            Log in
          </button>
        </header>

        <main className="landing-main">
          <div className="landing-pill">
            <span className="pulse-dot" />
            YOUR FRIENDS. ONE PLACE.
          </div>

          <h1>
            Your world.
            <br />
            <span>Your people.</span>
          </h1>

          <p className="landing-description">
            A beautiful place to chat, share photos, play games,
            discover music and stay close to the people who matter.
          </p>

          <div className="landing-buttons">
            <button
              className="landing-primary"
              onClick={() => {
                setAuthMode("signup");
                setShowAuth(true);
              }}
            >
              Create your account
              <span>→</span>
            </button>

            <button
              className="landing-secondary"
              onClick={() => {
                setAuthMode("login");
                setShowAuth(true);
              }}
            >
              I already have an account
            </button>
          </div>

          <div className="landing-features">
            <div>
              <span>💬</span>
              <strong>Chat</strong>
            </div>
            <div>
              <span>📸</span>
              <strong>Photos</strong>
            </div>
            <div>
              <span>🎮</span>
              <strong>Games</strong>
            </div>
            <div>
              <span>🎵</span>
              <strong>Music</strong>
            </div>
            <div>
              <span>🌎</span>
              <strong>Friends</strong>
            </div>
          </div>
        </main>

        <div className="floating-card card-left">
          <div className="mini-avatar purple-avatar">A</div>
          <div>
            <strong>Alex is online</strong>
            <span>Say hello 👋</span>
          </div>
        </div>

        <div className="floating-card card-right">
          <span className="music-disc">♫</span>
          <div>
            <strong>Now playing</strong>
            <span>Good vibes only</span>
          </div>
        </div>

        <div className="landing-bottom">
          <span>Private</span>
          <i />
          <span>Friendly</span>
          <i />
          <span>Made for people</span>
        </div>
      </div>
    );
  }

  const renderHome = () => (
    <>
      <section className="hero-card">
        <div className="hero-card-glow" />
        <div className="hero-copy">
          <span className="eyebrow">YOUR SPACE</span>
          <h1>
            Hey, {user.email?.split("@")[0] || "friend"}
            <span>.</span>
          </h1>
          <p>
            Everything you love about staying close to your people,
            all in one place.
          </p>

          <div className="hero-actions">
            <button
              onClick={() => setActivePage("messages")}
              className="hero-chat-button"
            >
              <span>💬</span>
              Start chatting
            </button>
            <button
              onClick={() => setActivePage("connect")}
              className="hero-outline-button"
            >
              Find friends
            </button>
          </div>
        </div>

        <div className="hero-avatar-area">
          <div className="hero-avatar-ring">
            <div className="hero-avatar">{firstLetter}</div>
          </div>
          <span>
            <i />
            Online
          </span>
        </div>
      </section>

      <section className="section-title-row">
        <div>
          <span className="eyebrow">EXPLORE</span>
          <h2>Made for your everyday.</h2>
        </div>
      </section>

      <section className="home-grid">
        <button
          className="home-feature chat-feature"
          onClick={() => setActivePage("messages")}
        >
          <div className="feature-top">
            <span className="big-feature-icon">💬</span>
            <span className="feature-arrow">↗</span>
          </div>
          <h3>Friendly chats</h3>
          <p>Talk privately with the people you care about.</p>
          <div className="feature-footer">
            <span>3 active conversations</span>
          </div>
        </button>

        <button
          className="home-feature photo-feature"
          onClick={() => setActivePage("photos")}
        >
          <div className="photo-preview">
            <div>📸</div>
            <div>✨</div>
            <div>🌈</div>
          </div>
          <h3>Photo moments</h3>
          <p>Keep your favorite memories together.</p>
          <div className="feature-footer">
            <span>Share a moment</span>
          </div>
        </button>

        <button
          className="home-feature game-feature"
          onClick={() => setActivePage("games")}
        >
          <div className="game-art">
            <span>🎮</span>
            <b>PLAY</b>
          </div>
          <h3>Play together</h3>
          <p>Jump into quick games with your friends.</p>
          <div className="feature-footer">
            <span>Game night starts here</span>
          </div>
        </button>

        <button
          className="home-feature music-feature"
          onClick={() => setActivePage("music")}
        >
          <div className="music-art">
            <span>♫</span>
            <div className="equalizer">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <h3>Music together</h3>
          <p>Discover sounds and share the vibe.</p>
          <div className="feature-footer">
            <span>Open your music room</span>
          </div>
        </button>
      </section>

      <section className="friends-panel">
        <div className="section-title-row compact">
          <div>
            <span className="eyebrow">PEOPLE</span>
            <h2>Your friends</h2>
          </div>
          <button onClick={() => setActivePage("connect")}>
            See all →
          </button>
        </div>

        <div className="friend-row">
          {demoFriends.map((friend) => (
            <button
              key={friend.name}
              className="friend-card"
              onClick={() => {
                setActivePage("messages");
                setSelectedChat(friend);
              }}
            >
              <div className={`friend-avatar ${friend.color}`}>
                {friend.avatar}
                <i />
              </div>
              <strong>{friend.name}</strong>
              <span>{friend.status}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );

  const renderMessages = () => (
    <section className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">MESSAGES</span>
          <h1>Your conversations</h1>
          <p>Stay close to your people, wherever they are.</p>
        </div>
        <button
          className="page-primary-button"
          onClick={() => showToast("New chat coming next 💬")}
        >
          + New chat
        </button>
      </div>

      <div className="chat-layout">
        <div className="chat-list">
          <div className="chat-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations"
            />
          </div>

          {demoChats
            .filter((chat) =>
              chat.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((chat) => (
              <button
                key={chat.name}
                className={`chat-list-item ${
                  selectedChat?.name === chat.name ? "selected" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className={`chat-avatar ${chat.color}`}>
                  {chat.avatar}
                  <i />
                </div>
                <div className="chat-list-copy">
                  <strong>{chat.name}</strong>
                  <span>{chat.message}</span>
                </div>
                <small>{chat.time}</small>
              </button>
            ))}
        </div>

        <div className="chat-window">
          {selectedChat ? (
            <>
              <div className="chat-window-header">
                <div className={`chat-avatar ${selectedChat.color}`}>
                  {selectedChat.avatar}
                  <i />
                </div>
                <div>
                  <strong>{selectedChat.name}</strong>
                  <span>Online now</span>
                </div>
              </div>

              <div className="chat-messages">
                <div className="message received">
                  Hey! Welcome to JD Friendly 👋
                </div>
                <div className="message received">
                  This is your beautiful new chat space.
                </div>
                <div className="message sent">
                  This looks amazing! ✨
                </div>
              </div>

              <div className="chat-input-row">
                <button onClick={() => showToast("Photo sharing coming next 📸")}>
                  +
                </button>
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                  placeholder={`Message ${selectedChat.name}...`}
                />
                <button onClick={sendMessage} className="send-button">
                  ↑
                </button>
              </div>
            </>
          ) : (
            <div className="empty-chat">
              <div>💬</div>
              <h3>Choose a conversation</h3>
              <p>Select a friend to open your chat.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const renderPhotos = () => (
    <section className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">MEMORIES</span>
          <h1>Your photos</h1>
          <p>Beautiful moments deserve a beautiful home.</p>
        </div>
        <button
          className="page-primary-button"
          onClick={() => showToast("Photo upload is the next feature 📸")}
        >
          + Add photo
        </button>
      </div>

      <div className="photo-wall">
        <div className="photo-tile photo-one">
          <span>🌅</span>
          <strong>Golden moments</strong>
        </div>
        <div className="photo-tile photo-two">
          <span>🌴</span>
          <strong>Weekend vibes</strong>
        </div>
        <div className="photo-tile photo-three">
          <span>🎉</span>
          <strong>Good times</strong>
        </div>
        <div className="photo-tile photo-four">
          <span>🌌</span>
          <strong>Night memories</strong>
        </div>
        <div className="photo-tile photo-five">
          <span>☕</span>
          <strong>Little things</strong>
        </div>
        <div className="photo-tile photo-six">
          <span>❤️</span>
          <strong>Our people</strong>
        </div>
      </div>
    </section>
  );

  const renderGames = () => (
    <section className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PLAYGROUND</span>
          <h1>Play with friends</h1>
          <p>Quick games. Friendly competition. Good memories.</p>
        </div>
      </div>

      <div className="games-grid">
        <button
          className="game-card game-purple"
          onClick={() => showToast("Tic Tac Toe is coming next 🎮")}
        >
          <span>⭕</span>
          <h3>Tic Tac Toe</h3>
          <p>Challenge a friend.</p>
          <b>Play →</b>
        </button>

        <button
          className="game-card game-blue"
          onClick={() => showToast("Memory game is coming next 🧠")}
        >
          <span>🧠</span>
          <h3>Memory Match</h3>
          <p>Test your memory.</p>
          <b>Play →</b>
        </button>

        <button
          className="game-card game-pink"
          onClick={() => showToast("Quiz game is coming next ✨")}
        >
          <span>⚡</span>
          <h3>Quick Quiz</h3>
          <p>Who knows more?</p>
          <b>Play →</b>
        </button>
      </div>
    </section>
  );

  const renderMusic = () => (
    <section className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">LISTEN TOGETHER</span>
          <h1>Your music room</h1>
          <p>Put on something good and share the vibe.</p>
        </div>
      </div>

      <div className="music-room">
        <div className="record">
          <div className="record-center">♫</div>
        </div>

        <div className="music-info">
          <span>NOW PLAYING</span>
          <h2>Good Vibes Only</h2>
          <p>JD Friendly Radio</p>

          <div className="music-progress">
            <span />
          </div>

          <div className="music-time">
            <span>0:42</span>
            <span>3:28</span>
          </div>

          <div className="music-controls">
            <button>↶</button>
            <button className="play-button">▶</button>
            <button>↷</button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderConnect = () => (
    <section className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PEOPLE</span>
          <h1>Find your friends</h1>
          <p>Bring your people into your JD Friendly world.</p>
        </div>
        <button
          className="page-primary-button"
          onClick={() => showToast("Friend invites coming next 👥")}
        >
          + Invite friend
        </button>
      </div>

      <div className="people-grid">
        {demoFriends.map((friend) => (
          <div className="person-card" key={friend.name}>
            <div className={`person-avatar ${friend.color}`}>
              {friend.avatar}
              <i />
            </div>
            <h3>{friend.name}</h3>
            <p>{friend.status}</p>
            <button
              onClick={() => {
                setActivePage("messages");
                setSelectedChat(friend);
              }}
            >
              Message
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  const renderPage = () => {
    if (activePage === "home") return renderHome();
    if (activePage === "messages") return renderMessages();
    if (activePage === "photos") return renderPhotos();
    if (activePage === "games") return renderGames();
    if (activePage === "music") return renderMusic();
    if (activePage === "connect") return renderConnect();

    return renderHome();
  };

  return (
    <div className="jd-app">
      <div className="app-background">
        <div className="app-orb app-orb-one" />
        <div className="app-orb app-orb-two" />
        <div className="app-orb app-orb-three" />
      </div>

      <header className="app-header">
        <button
          className="app-logo-area"
          onClick={() => setActivePage("home")}
        >
          <div className="app-logo">JD</div>
          <div className="app-brand">
            <strong>JD Friendly</strong>
            <span>Connect • Share • Play</span>
          </div>
        </button>

        <div className="header-center">
          <div className="global-search">
            <span>⌕</span>
            <input
              placeholder="Search friends, chats..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="header-actions">
          <div className="connection-status">
            <i />
            {serverStatus}
          </div>

          <button
            className="header-avatar"
            onClick={() => showToast("Profile settings coming next 👤")}
          >
            {firstLetter}
          </button>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-label">YOUR SPACE</div>

          {navItems.map((item) => (
            <button
              key={item.id}
              className={activePage === item.id ? "active" : ""}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "messages" && <b>3</b>}
            </button>
          ))}

          <div className="sidebar-bottom">
            <div className="mini-profile">
              <div>{firstLetter}</div>
              <section>
                <strong>{user.email?.split("@")[0] || "Friend"}</strong>
                <span>Online</span>
              </section>
            </div>

            <button
              className="sidebar-settings"
              onClick={() => showToast("Settings are coming next ⚙️")}
            >
              ⚙️ <span>Settings</span>
            </button>
          </div>
        </aside>

        <main className="app-content">{renderPage()}</main>
      </div>

      <nav className="mobile-nav">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            className={activePage === item.id ? "active" : ""}
            onClick={() => setActivePage(item.id)}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>

      {toast && <div className="jd-toast">{toast}</div>}
    </div>
  );
}

export default App;
