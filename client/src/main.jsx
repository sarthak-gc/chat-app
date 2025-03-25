import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import CreateGroup from "./pages/CreateGroup";
import { RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/PageNotFound";
import { CurrentPageProvider } from "./context/CurrentPageProvider";
import GroupPage from "./pages/GroupPage";
import UserPage from "./pages/UserPage";
import Settings from "./pages/Settings";
import Message from "./pages/Message";
import GroupDetails from "./components/GroupDetails";
import { UserDetails } from "./context/UserDetails";

const router = createBrowserRouter([
  { path: "/", element: <Login />, errorElement: <PageNotFound /> },
  { path: "search", element: <SearchPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/feed",
    element: <Feed />,
    children: [
      { path: "users", element: <UserPage /> },
      {
        path: "groups",
        element: <GroupPage />,
        children: [{ path: "create", element: <CreateGroup /> }],
      },
      { path: "settings", element: <Settings /> },
    ],
  },

  { path: "message/user/:userId", element: <Message /> },
  { path: "details/group/:groupId", element: <GroupDetails /> },
]);

createRoot(document.getElementById("root")).render(
  <UserDetails>
    <CurrentPageProvider>
      <RouterProvider router={router} />
    </CurrentPageProvider>
  </UserDetails>
);
