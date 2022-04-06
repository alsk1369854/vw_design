import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import ProjectMange from './pages/ProjectManage';
import Edit from './pages/Edit';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="ProjectManage" element={<ProjectMange />} />
        <Route path="Edit" element={<Edit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;