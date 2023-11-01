import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PostitTable from './postit_table';
import LoginPage from './login';
import SignUp from './signUp';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/PostitTable' element={<PostitTable />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


