import { Routes, Route,BrowserRouter } from 'react-router-dom';
import ShowUsers from './components/AllUsers';
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
<BrowserRouter>
    <Routes>
      <Route path="/" element={<ShowUsers></ShowUsers>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
