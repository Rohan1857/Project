import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import AllProblems from './Pages/AllProblems/AllProblems';
import ProblemDetails from './Pages/ProblemDetails/ProblemDetail';
import AddProblem from './Pages/AddProblem/AddProblem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/problems" element={<AllProblems />} />
        <Route path ="/AddProblem" element={<AddProblem />} />
        <Route path="/problem/:id" element={<ProblemDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
