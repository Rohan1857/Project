import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import AllProblems from './Pages/AllProblems/AllProblems';
import ProblemDetails from './Pages/ProblemDetails/ProblemDetail';
import AddProblem from './Pages/AddProblem/AddProblem';
import Header from './components/Header';
import UserDashboard from './Pages/Dashboard/UserDashboard';
function ProblemsLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AddProblem" element={<AddProblem />} />
        
        {/* Only wrap these two with header */}
        <Route
          path="/problems"
          element={
            <ProblemsLayout>
              <AllProblems />
            </ProblemsLayout>
          }
        />
        <Route
          path="/problem/:id"
          element={
            <ProblemsLayout>
              <ProblemDetails />
            </ProblemsLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProblemsLayout>
              <UserDashboard />
            </ProblemsLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;