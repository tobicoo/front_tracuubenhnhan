import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/globals.css"; // ensure project globals (colors, variables) are loaded
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
