import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main";

function App() {
  return (
    <Router>
      <div className="App wrapper">
        <Routes>
          <Route element={<Main>test</Main>} path="/" />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
