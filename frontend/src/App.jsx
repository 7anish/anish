import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Chat from './pages/Chat';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import WorkExperience from './pages/WorkExperience';
import Images from './pages/Images';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Chat />} />
          <Route path="about" element={<About />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="work-experience" element={<WorkExperience />} />
          <Route path="images" element={<Images />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
