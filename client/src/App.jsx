import { createBrowserRouter } from "react-router-dom";
import CreateGroup from "./pages/CreateGroup";
import { RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import PageNotFound from "./pages/PageNotFound";
import { CurrentPageProvider } from "./context/CurrentPageProvider";
import GroupPage from "./pages/GroupPage";
import UserPage from "./pages/UserPage";
import Settings from "./pages/Settings";
import Message from "./pages/Message";
import { UserDetails } from "./context/UserDetails";
import UserDetailPage from "./pages/UserDetailPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Analytics } from "@vercel/analytics/react";

const router = createBrowserRouter([
  { path: "/", element: <Login />, errorElement: <PageNotFound /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/feed",
    element: <ProtectedRoute element={<Feed />} />,
    children: [
      {
        path: "users",
        element: <ProtectedRoute element={<UserPage />} />,
      },
      {
        path: "groups",
        element: <ProtectedRoute element={<GroupPage />} />,
      },
      {
        path: "groups/create",
        element: <ProtectedRoute element={<CreateGroup />} />,
      },
      {
        path: ":groups/:groupId/detail",
        element: <ProtectedRoute element={<GroupDetailPage />} />,
      },
      {
        path: "users/:userId/detail",
        element: <ProtectedRoute element={<UserDetailPage />} />,
      },
      { path: "settings", element: <ProtectedRoute element={<Settings />} /> },
      {
        path: "users/:userId/message",
        element: <ProtectedRoute element={<Message />} />,
      },
      {
        path: "groups/:groupId/message",
        element: <ProtectedRoute element={<Message />} />,
      },
    ],
  },
]);

const App = () => {
  return (
    <UserDetails>
      <CurrentPageProvider>
        <RouterProvider router={router} />
        <Analytics />
      </CurrentPageProvider>
    </UserDetails>
  );
};

export default App;
