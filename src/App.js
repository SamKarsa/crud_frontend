import { Routes, Route,BrowserRouter } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import Showusers from './components/showUsers/ShowUsers';
import Header from './components/header/Header';

function App() {
  return (
<BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Showusers></Showusers>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
