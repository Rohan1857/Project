import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import AllProblems from './Pages/AllProblems';
import ProblemDetails from './Pages/ProblemDetail';
import AddProblem from './Pages/AddProblem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/problems" element={<AllProblems />} />
        <Route path ="/AddProblem" element={<AddProblem />} />
        <Route path="/problem/:id" element={<ProblemDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
