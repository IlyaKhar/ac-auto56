import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import "./api/authHttp.js";
import App from "./App.jsx";
import "./index.css";

/** Показать падение React вместо пустого белого экрана (удобно в Docker / проде). */
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }

  static getDerivedStateFromError(err) {
    return { err };
  }

  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui,sans-serif", maxWidth: 640 }}>
          <h1 style={{ fontSize: 18 }}>Ошибка при загрузке интерфейса</h1>
          <p style={{ color: "#444", marginTop: 8 }}>
            Открой консоль браузера (F12). Частая причина в Docker: зайди именно на{" "}
            <strong>http://localhost:5173</strong> (сайт), а не на порт API (8080).
          </p>
          <pre
            style={{
              marginTop: 16,
              padding: 12,
              background: "#f5f5f5",
              overflow: "auto",
              fontSize: 12,
            }}
          >
            {String(this.state.err)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </RootErrorBoundary>
  </React.StrictMode>,
);
