import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import Moviespage from './Pages/Moviespage';
import 'react-toastify/dist/ReactToastify.css';
import Addmovie from './Pages/Addmovie';
import Editmovie from './Pages/Editmovie';
import { useEffect, useState } from 'react';


function App() {
  const [render,setRender]=useState(false)
  const navigate=useNavigate()
  const user=JSON.parse(localStorage.getItem('userInfo'))
  
 function Render(){
  setRender(!render)
 }
  
  return (
    <div className="App">
      <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/movies' element={<Moviespage Render={Render} render={render}/>} />
          <Route path='/addmovie' element={<Addmovie/>}/>
          <Route path='/editmovie/:movieid' element={<Editmovie />} />
      </Routes>
    </div>
  );
}

export default App;
