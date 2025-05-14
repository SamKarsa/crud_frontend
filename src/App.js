import { Routes, Route,BrowserRouter } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
<<<<<<< HEAD
import ShowUsers from './components/AllUsers';
import "bootstrap-icons/font/bootstrap-icons.css";
=======
import Showusers from './components/showUsers/ShowUsers';
import Header from './components/header/Header';
>>>>>>> 1bd6cee069a716aa41ff5c1e89c1f146803e1f06

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
