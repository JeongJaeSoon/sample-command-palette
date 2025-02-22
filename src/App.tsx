import { Routes, Route, Link } from "react-router-dom";
import { About, Home, Users } from "./page";
import { useCommandPaletteHandler } from "./hooks/useCommandPaletteHandler";
import { CommandPalette } from "./components";

function App() {
  useCommandPaletteHandler();

  return (
    <div className="App">
      <CommandPalette />
      <header style={{ backgroundColor: "lightgray", padding: "20px", textAlign: "center"}}>
        <ul style={{ display: "flex", gap: "4rem", listStyle: "none", textAlign: "center", margin: "0 auto", width: "fit-content" }}>
          <li style={{width: "6rem"}}><Link to="/">Home</Link></li>
          <li style={{width: "6rem"}}><Link to="/about">About</Link></li>
          <li style={{width: "6rem" }}><Link to="/users">Users</Link></li>
        </ul>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
}

export default App;
