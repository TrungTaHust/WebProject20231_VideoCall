import './App.css';
import Login from './components/Login/index';
import Lobby from './components/test/lobby';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddRoomModal from './components/Modals/AddRoomModal';
import InviteMemberModal from './components/Modals/InviteMemberModal';
import Home from "./Home";
import Room from "./Room";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Switch>
            <Route component={Room} path='/room/:roomID' />
            <Route component={Login} path='/login' />
            <Route component={Lobby} path='/lobby' />
            <Route component={Home} path='/home' />
            <Route component={ChatRoom} path='/' />
          </Switch>
          <AddRoomModal />
          <InviteMemberModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
