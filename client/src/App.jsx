// import React from "react";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Feed from "./pages/Feed";
// import { Route, Routes } from "react-router-dom";
// import SearchPage from "./pages/SearchPage";
// import PageNotFound from "./pages/PageNotFound";
// import { CurrentPageProvider } from "./context/CurrentPageProvider";
// import GroupPage from "./pages/GroupPage";
// import UserPage from "./pages/UserPage";
// import Settings from "./pages/Settings";
// import Message from "./pages/Message";
// import GroupDetails from "./components/GroupDetails";
// import { UserDetails } from "./context/UserDetails";
// import CreateGroup from "./pages/CreateGroup";

// const App = () => {
//   return (
//     <>
//       <UserDetails>
//         <CurrentPageProvider>
//           <Routes>
//             <Route path="*" element={<PageNotFound />} />
//             <Route path="search" element={<SearchPage />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/feed" element={<Feed />}>
//               <Route path="users" element={<UserPage />} />
//               <Route path="groups" element={<GroupPage />}>
//                 <Route path="create" element={<CreateGroup />} />
//               </Route>
//               <Route path="settings" element={<Settings />} />
//             </Route>
//             <Route path="message/user/:userId" element={<Message />} />
//             <Route path="details/group/:groupId" element={<GroupDetails />} />
//           </Routes>

//         </CurrentPageProvider>
//       </UserDetails>
//     </>
//   );
// };

// export default App;

import React from 'react'

const App = () => {
  return (
    <div>App</div>
  )
}

export default App