import { Routes, Route, useLocation } from 'react-router-dom';
import Products from './pages/admin/Products';

import Login from './pages/admin/Login';
import Settings from './pages/admin/Settings';
import Users from './pages/admin/Users';
import Home from './pages/client/Home';
import Reservation from './pages/admin/Reservation';
import { Provider } from 'react-redux';
import adminStore from './redux/adminStore';

import RequireAuth from './pages/admin/RequireAuth';
import Reserve from './pages/client/Reserve';
import NavBars from './pages/client/NavBars';
import { Footer } from './pages/client/Footer';

const client = ['/', '/Menu', '/Reservation', '/Contact', '/Cart'];

function App() {
  const location = useLocation();

  console.log('curr', location);

  return (
    <div
      className={
        `App w-screen ` + client.includes(location.pathname)
          ? `h-auto`
          : `h-screen`
      }
    >
      {client.includes(location.pathname) ? (
        <header>
          <NavBars />
        </header>
      ) : (
        ''
      )}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/reservation' element={<Reserve />} />
      </Routes>

      {client.includes(location.pathname) ? <Footer /> : ''}

      <Provider store={adminStore}>
        <>
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
        </>
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
