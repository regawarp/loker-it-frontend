import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from "./components/Main";
import Poster from "./components/Poster";
import Caption from "./components/Caption";

function App() {
  return (
    <Router>
      <div className="App wrapper">
        <Routes>
          <Route element={<Main>test</Main>} path="/" />
        </Routes>
        <Routes>
          <Route element={<Main><Caption /></Main>} path="/caption" />
        </Routes>
        <Routes>
          <Route
            element={
              <Main>
                <Poster />
              </Main>
            }
            path="/poster"
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
