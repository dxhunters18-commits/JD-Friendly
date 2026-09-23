import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

const QUOTES = [
  "The best moments are the ones we share.",
  "Friendship is the quiet comfort of knowing someone is there.",
  "Life becomes beautiful when shared with the right people.",
  "Good friends make ordinary moments unforgettable.",
];

const NAV = [
  ["home", "Home", "⌂"],
  ["friends", "Friends", "♧"],
  ["messages", "Messages", "◌"],
  ["photos", "Photos", "▧"],
  ["games", "Games", "◇"],
  ["music", "Music", "♫"],
  ["profile", "Profile", "○"],
  ["settings", "Settings", "⚙"],
];

function Logo({ compact = false }) {
  return (
    <div className={`jd-logo ${compact ? "compact" : ""}`}>
      <div className="jd-mark">
        <span>J</span>
        <span>D</span>
      </div>
      {!compact && (
        <div className="jd-wordmark">
          <strong>JD Friendly</strong>
          <small>with friends</small>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, text, action, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{text}</p>
      {action && (
        <button className="premium-button" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");

  const winner = useMemo(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.every(Boolean) ? "draw" : null;
  }, [board]);

  function play(index) {
    if (board[index] || winner) return;

    const next = [...board];
    next[index] = turn;
    setBoard(next);
    setTurn(turn === "X" ? "O" : "X");
  }

  function reset() {
    setBoard(Array(9).fill(""));
    setTurn("X");
  }

  return (
    <div className="game-card">
      <div className="game-card-top">
        <div>
          <span className="eyebrow">ONLINE GAME</span>
          <h3>Tic Tac Toe</h3>
        </div>
        <span className="game-status">PRIVATE</span>
      </div>

      <div className="tic-board">
        {board.map((cell, index) => (
          <button key={index} onClick={() => play(index)}>
            {cell}
          </button>
        ))}
      </div>

      <div className="game-footer">
        <span>
          {winner
            ? winner === "draw"
              ? "Draw game"
              : `${winner} wins`
            : `Turn: ${turn}`}
        </span>

        <button className="small-button" onClick={reset}>
          New game
        </button>
      </div>
    </div>
  );
}

function ConnectFour() {
  const [cells, setCells] = useState(Array(42).fill(""));
  const [turn, setTurn] = useState("A");

  function drop(column) {
    for (let row = 5; row >= 0; row--) {
      const index = row * 7 + column;
      if (!cells[index]) {
        const next = [...cells];
        next[index] = turn;
        setCells(next);
        setTurn(turn === "A" ? "B" : "A");
        return;
      }
    }
  }

  function reset() {
    setCells(Array(42).fill(""));
    setTurn("A");
  }

  return (
    <div className="game-card">
      <div className="game-card-top">
        <div>
          <span className="eyebrow">ONLINE GAME</span>
          <h3>Connect Four</h3>
        </div>
        <span className="game-status">PRIVATE</span>
      </div>

      <div className="connect-board">
        {cells.map((cell, index) => (
          <button
            key={index}
            onClick={() => drop(index % 7)}
            className={cell ? `piece-${cell}` : ""}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="game-footer">
        <span>Player {turn}'s turn</span>
        <button className="small-button" onClick={reset}>
          New game
        </button>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("violet");
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((value) => (value + 1) % QUOTES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const displayName =
    session?.user?.user_metadata?.full_name ||
    session?.user?.email?.split("@")[0] ||
    "Friend";

  async function handleAuth(event) {
    event.preventDefault();
    setAuthError("");
    setMessage("");
    setAuthLoading(true);

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;

        setMessage(
          "Your account has been created. Check your email if confirmation is required."
        );
      }
    } catch (error) {
      setAuthError(error.message || "Something went wrong.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setPage("home");
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <Logo />
        <div className="loading-line">
          <span />
        </div>
        <p>Preparing your private space</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`auth-screen theme-${theme}`}>
        <div className="auth-orbit orbit-one" />
        <div className="auth-orbit orbit-two" />

        <div className="auth-left">
          <Logo />

          <div className="auth-intro">
            <span className="eyebrow">PRIVATE SOCIAL SPACE</span>
            <h1>
              Friends.
              <br />
              <em>Only the people you choose.</em>
            </h1>
            <p>
              JD Friendly is a private place for real friendships,
              conversations, photos, games and music.
            </p>
          </div>

          <div className="quote">
            <span>“</span>
            <p>{QUOTES[quoteIndex]}</p>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-head">
            <span className="eyebrow">
              {authMode === "login" ? "WELCOME BACK" : "JOIN JD FRIENDLY"}
            </span>
            <h2>{authMode === "login" ? "Enter your space" : "Create your space"}</h2>
            <p>
              {authMode === "login"
                ? "Sign in to continue privately."
                : "Create your personal private account."}
            </p>
          </div>

          <form onSubmit={handleAuth}>
            {authMode === "signup" && (
              <label>
                <span>Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                required
              />
            </label>

            {authError && <div className="form-error">{authError}</div>}
            {message && <div className="form-success">{message}</div>}

            <button className="auth-submit" disabled={authLoading}>
              {authLoading
                ? "Please wait..."
                : authMode === "login"
                ? "Enter JD Friendly"
                : "Create account"}
            </button>
          </form>

          <div className="auth-switch">
            {authMode === "login" ? "New to JD Friendly?" : "Already have an account?"}
            <button
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setAuthError("");
                setMessage("");
              }}
            >
              {authMode === "login" ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderPage() {
    if (page === "home") {
      return (
        <section className="page">
          <div className="hero-panel">
            <div>
              <span className="eyebrow">YOUR PRIVATE SPACE</span>
              <h1>
                Welcome,
                <br />
                <em>{displayName}.</em>
              </h1>
              <p>
                A private place for you and the friends you choose.
              </p>
            </div>

            <div className="hero-mark">
              <Logo compact />
            </div>
          </div>

          <div className="quote-panel">
            <span>“</span>
            <div>
              <p>{QUOTES[quoteIndex]}</p>
              <small>JD Friendly</small>
            </div>
          </div>

          <div className="feature-grid">
            {[
              ["♧", "Friends", "Connect with real people you choose.", "friends"],
              ["◌", "Messages", "Private conversations between friends.", "messages"],
              ["▧", "Photos", "Share memories privately with selected people.", "photos"],
              ["◇", "Games", "Play together with friends online.", "games"],
              ["♫", "Music", "Keep your music space close.", "music"],
              ["○", "Your Profile", "Control how your private identity appears.", "profile"],
            ].map(([icon, title, text, target]) => (
              <button
                key={target}
                className="feature-card"
                onClick={() => setPage(target)}
              >
                <span className="feature-icon">{icon}</span>
                <strong>{title}</strong>
                <p>{text}</p>
                <span className="feature-arrow">→</span>
              </button>
            ))}
          </div>
        </section>
      );
    }

    if (page === "friends") {
      return (
        <section className="page">
          <PageHeading
            eyebrow="PEOPLE YOU CHOOSE"
            title="Friends"
            text="Your private friend space. No public follower lists."
          />

          <div className="private-panel">
            <div className="search-row">
              <input placeholder="Search for a person..." />
              <button className="premium-button">Find</button>
            </div>

            <EmptyState
              icon="♧"
              title="Your friends will appear here"
              text="There are no demo profiles here. Only real people you connect with will appear."
            />
          </div>
        </section>
      );
    }

    if (page === "messages") {
      return (
        <section className="page">
          <PageHeading
            eyebrow="PRIVATE CONVERSATIONS"
            title="Messages"
            text="One-to-one conversations with your friends."
          />

          <div className="private-panel">
            <EmptyState
              icon="◌"
              title="No conversations yet"
              text="Your private conversations will appear here after you connect with friends."
            />
          </div>
        </section>
      );
    }

    if (page === "photos") {
      return (
        <section className="page">
          <PageHeading
            eyebrow="PRIVATE MEMORIES"
            title="Photos"
            text="Photos shared privately between you and selected friends."
          />

          <div className="private-panel photo-private">
            <div className="privacy-badge">PRIVATE BY DESIGN</div>
            <EmptyState
              icon="▧"
              title="No private photos yet"
              text="There is no public gallery here. Photos belong to you and the people you choose."
            />
          </div>
        </section>
      );
    }

    if (page === "games") {
      return (
        <section className="page">
          <PageHeading
            eyebrow="PLAY TOGETHER"
            title="Games"
            text="Games are for you and your online friends."
          />

          <div className="games-grid">
            <TicTacToe />
            <ConnectFour />
          </div>

          <div className="private-panel game-note">
            <span className="eyebrow">PRIVATE MULTIPLAYER</span>
            <h3>Invite a friend when multiplayer is connected.</h3>
            <p>
              These games are the private game area. Real online multiplayer
              requires the shared game service to connect both players.
            </p>
          </div>
        </section>
      );
    }

    if (page === "music") {
      return (
        <section className="page">
          <PageHeading
            eyebrow="YOUR SOUND"
            title="Music"
            text="A private place for your music experience."
          />

          <div className="music-panel">
            <div className="music-disc">
              <div>JD</div>
            </div>
            <div>
              <span className="eyebrow">JD FRIENDLY MUSIC</span>
              <h2>Your music space</h2>
              <p>
                Music belongs here without turning your private space into a
                public feed.
              </p>
            </div>
          </div>
        </section>
      );
    }

    if (page === "profile") {
      return (
        <section className="page">
          <PageHeading
            eyebrow="YOUR IDENTITY"
            title="Profile"
            text="Only your own account information belongs here."
          />

          <div className="profile-card">
            <div className="profile-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="eyebrow">YOUR NAME</span>
              <h2>{displayName}</h2>
              <p>{session.user.email}</p>
            </div>
          </div>

          <div className="private-panel">
            <div className="settings-row">
              <div>
                <strong>Profile photo</strong>
                <p>Change the photo people see on your private profile.</p>
              </div>
              <button className="small-button">Change</button>
            </div>

            <div className="settings-row">
              <div>
                <strong>Username</strong>
                <p>Choose how your friends identify you.</p>
              </div>
              <button className="small-button">Edit</button>
            </div>
          </div>
        </section>
      );
    }

    if (page === "settings") {
      return (
        <section className="page">
          <PageHeading
            eyebrow="CONTROL YOUR SPACE"
            title="Settings"
            text="Your private preferences, your way."
          />

          <div className="settings-stack">
            <div className="setting-section">
              <span className="eyebrow">APPEARANCE</span>
              <h3>Theme</h3>
              <p>Keep the black foundation and choose your accent.</p>

              <div className="theme-options">
                {[
                  ["violet", "Royal Violet"],
                  ["blue", "Midnight Blue"],
                  ["gold", "Classic Gold"],
                  ["red", "Deep Ruby"],
                  ["green", "Emerald"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={`theme-choice ${value} ${
                      theme === value ? "active" : ""
                    }`}
                    onClick={() => setTheme(value)}
                  >
                    <span />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-section">
              <span className="eyebrow">ACCOUNT</span>

              <div className="settings-row">
                <div>
                  <strong>Profile</strong>
                  <p>Change your profile photo, name and username.</p>
                </div>
                <button
                  className="small-button"
                  onClick={() => setPage("profile")}
                >
                  Open
                </button>
              </div>

              <div className="settings-row">
                <div>
                  <strong>Sign out</strong>
                  <p>Leave this device securely.</p>
                </div>
                <button className="danger-button" onClick={logout}>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return null;
  }

  return (
    <div className={`app theme-${theme}`}>
      <aside className="sidebar">
        <Logo />

        <nav>
          {NAV.map(([id, label, icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => setPage(id)}
            >
              <span>{icon}</span>
              <label>{label}</label>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-user">
            <div>{displayName.charAt(0).toUpperCase()}</div>
            <span>{displayName}</span>
          </div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <span className="topbar-title">JD Friendly</span>
            <span className="topbar-subtitle">private social space</span>
          </div>

          <button className="top-profile" onClick={() => setPage("profile")}>
            <span>{displayName.charAt(0).toUpperCase()}</span>
          </button>
        </header>

        {renderPage()}
      </main>

      <nav className="mobile-nav">
        {NAV.map(([id, label, icon]) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => setPage(id)}
          >
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}

function PageHeading({ eyebrow, title, text }) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}

export default App;
