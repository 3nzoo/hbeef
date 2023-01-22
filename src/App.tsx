import { Routes, Route } from 'react-router-dom';
import Products from './pages/admin/Products';

import Login from './pages/admin/Login';
import Settings from './pages/admin/Settings';
import Testing from './pages/admin/Testing';
import Users from './pages/admin/Users';
import Home from './pages/Home';
import Reservation from './pages/admin/Reservation';
import { Provider } from 'react-redux';
import adminStore from './redux/adminStore';

function App() {
  return (
    <div className='App h-screen w-screen'>
      <Provider store={adminStore}>
        <div className='fixed flex h-full max-w-full w-screen '>
          <Routes>
            <Route path='/admin'>
              <Route index element={<Products />} />
              <Route path='users' element={<Users />} />
              <Route path='settings' element={<Settings />} />
              <Route path='reservation' element={<Reservation />} />
            </Route>
          </Routes>
        </div>
      </Provider>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}

//? <Route path="*" element={<Navigate to="/" replace /> } />
//? to make other path inaccessible

//? <Route path='/id'>
//?  <Route index element={<component/>}/>
//?  <Route path='edit' element={<editcomponent/> }/>
//! local.com/id/edit = used when modifying products or userpassW
//? </Route>

export default App;

//!! wickedblocks wickedtemplates.com
//!! kitwind
//
