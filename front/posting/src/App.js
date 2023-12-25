import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PostitTable from './postit_table';
import LoginPage from './login';
import SignUp from './signUp';
import FindPw from './findPW';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/PostitTable' element={<PostitTable />} />
          <Route path='/FindPw' element={<FindPw />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


