import { Routes, Route, useLocation } from 'react-router-dom';
import Products from './pages/admin/Products';

import Login from './pages/admin/Login';
import Settings from './pages/admin/Settings';
import Users from './pages/admin/Users';
import Home from './pages/client/Home';
import Reservation from './pages/admin/Reservation';
import { Provider as AdminProvider } from 'react-redux';
import { Provider as ClientProvider } from 'react-redux';
import clientStore from './redux/clientStore';
import adminStore from './redux/adminStore';

import RequireAuth from './pages/admin/RequireAuth';
import Reserve from './pages/client/Reserve';
import NavBars from './pages/client/NavBars';
import { Footer } from './pages/client/Footer';
import Contact from './pages/client/Contact';
import Cart from './pages/client/Cart';
import PageNotFound from './pages/client/NotFound';
import Menu from './pages/client/menu/Menu';

const client = ['/', '/menu', '/reservation', '/contact', '/cart'];
const adm = [
  '/admin',
  '/admin/users',
  '/admin/reservation',
  '/admin/settings',
  '/login',
];

function App() {
  const location = useLocation();

  return (
    <div
      className={
        `App w-screen ` + client.includes(location.pathname)
          ? `h-auto`
          : `h-screen`
      }
    >
      <div>
        <ClientProvider store={clientStore}>
          {!adm.includes(location.pathname) ? (
            <header>
              <NavBars />
            </header>
          ) : (
            ''
          )}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/reservation' element={<Reserve />} />
            <Route path='/menu' element={<Menu />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/cart' element={<Cart />} />

            {!adm.includes(location.pathname) ? (
              <Route path='*' element={<PageNotFound />} />
            ) : (
              ''
            )}
          </Routes>

          {client.includes(location.pathname.toLowerCase()) ? <Footer /> : ''}
        </ClientProvider>
      </div>

      <AdminProvider store={adminStore}>
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
      </AdminProvider>
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
