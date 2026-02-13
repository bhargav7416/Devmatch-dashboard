import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import DeveloperList from './components/Developers/DeveloperList';
import ProjectList from './components/Projects/ProjectList';
import MatchingView from './components/Assignments/MatchingView';
import AssignmentHistory from './components/Assignments/AssignmentHistory';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/developers" element={<DeveloperList />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/matching" element={<MatchingView />} />
          <Route path="/assignments" element={<AssignmentHistory />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
