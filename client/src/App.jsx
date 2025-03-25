import { createBrowserRouter } from "react-router-dom";
import CreateGroup from "./pages/CreateGroup";
import { RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
// import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/PageNotFound";
import { CurrentPageProvider } from "./context/CurrentPageProvider";
import GroupPage from "./pages/GroupPage";
import UserPage from "./pages/UserPage";
import Settings from "./pages/Settings";
import Message from "./pages/Message";
import GroupDetails from "./components/GroupDetails";
import { UserDetails } from "./context/UserDetails";
import UserDetailPage from "./pages/UserDetailPage";
import MessageArea from "./components/MessageArea";

const router = createBrowserRouter([
  { path: "/", element: <Login />, errorElement: <PageNotFound /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/feed",
    element: <Feed />,
    children: [
      {
        path: "users",
        element: <UserPage />,
      },
      {
        path: "groups",
        element: <GroupPage />,
        children: [
          { path: "create", element: <CreateGroup /> },
          { path: ":groupId/details", element: <GroupDetails /> },
        ],
      },
      { path: "user/:userId/detail", element: <UserDetailPage /> },

      { path: "settings", element: <Settings /> },
      { path: "user/:userId/message", element: <Message /> },
    ],
  },
  { path: "/testing", element: <MessageArea /> },
]);

const App = () => {
  return (
    <UserDetails>
      <CurrentPageProvider>
        <RouterProvider router={router} />
      </CurrentPageProvider>
    </UserDetails>
  );
};

export default App;
