import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/index";
const App = () => {
  return (
    <>
      <Router>
        <main className="bg-black">
          <Routes>
            <Route path="/iphone_store" element={<Home />} />
          </Routes>
        </main>
      </Router>
    </>
  );
};

export default App;
