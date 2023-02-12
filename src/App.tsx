import { Routes, Route } from 'react-router-dom';
import Products from './pages/admin/Products';

import Login from './pages/admin/Login';
import Settings from './pages/admin/Settings';
import Users from './pages/admin/Users';
import Home from './pages/client/Home';
import Reservation from './pages/admin/Reservation';
import { Provider } from 'react-redux';
import adminStore from './redux/adminStore';

import RequireAuth from './pages/admin/RequireAuth';

function App() {
  return (
    <div className='App h-screen w-screen'>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      <Provider store={adminStore}>
        <div className='flex min-h-screen w-full '>
          <Routes>
            <Route path='/login' element={<Login />} />
            {/* protected */}
            <Route element={<RequireAuth />}>
              <Route path='/admin' element={<Products />} />
              <Route path='/admin/users' element={<Users />} />
              <Route path='/admin/settings' element={<Settings />} />
              <Route path='/admin/reservation' element={<Reservation />} />
            </Route>
          </Routes>
        </div>
      </Provider>
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
