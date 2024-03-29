import { useLocation, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import PostitTable from './postit_table';
import LoginPage from './login';
import SignUp from './signUp_main';
import FindPw from './findPW';
import ErrorBoundary from './errorBoundary'; 
import Error from './error';
import Monitor from './monitor';

function Main() {

  const location = useLocation();
  const isLoginOrSignUp = location.pathname === '/' || location.pathname === '/SignUp';
  const appClass = isLoginOrSignUp ?  'App-small' : 'App';

  return (
    <div className={appClass}>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/PostitTable' element={<PostitTable />} />
          <Route path='/FindPw' element={<FindPw />} />
          <Route path='/error' element={<Error />} />
          <Route path='/monitor' element={<Monitor />} />
        </Routes>
      
    </div>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Main />
      </ErrorBoundary>
    </Router>
  );
}

export default App;


