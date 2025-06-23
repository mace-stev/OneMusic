import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import PlaylistDetails from '../components/PlaylistDetails';
import Home from '../components/Home'
import Layout from './Layout';
import SongSearchPage from '../components/SongSearchPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "playlist/:id",
        element: <PlaylistDetails/>
      },
      {
        path: "/songs/search",
        element: <SongSearchPage/>
      }
    ],
  },
]);
