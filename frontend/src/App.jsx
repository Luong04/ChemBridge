import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Main from "./pages/Main/Main";
import Verification from "./pages/Login/Verification";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from "react";
const App = () => {
  const [session, setSession] = useState();

  return (
    <>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login session={session} setSession={setSession}/>} />
          <Route path="/main" element={<Main session={session} />} />
          {/* <Route path="/room" element={<Main />} /> */}
          {/* <Route path="/revenue" element={<Revenue />} />
          <Route path="/roombooking-report" element={<RoomBooking />} />*/}
          {/* <Route path="/verification" element={<Verification />} />  */}
        </Routes>
      </div>
    </>
  );
};

export default App;
