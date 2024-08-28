import React from "react";

import Form from "./Components/Form";

import Signup from "./Components/Signup";

import Task from "./Components/Task";


import { Routes, Route } from "react-router-dom";



function App() {
  return (
    <div className="ml-52 items-center justify-center w-full lg:w-1/2  ">
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Task" element={<Task/>}/>
      </Routes>
    </div>
  );
}

export default App
