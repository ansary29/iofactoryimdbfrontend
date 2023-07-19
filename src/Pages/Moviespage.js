import React, { useEffect, useState } from 'react';
import '../Css/Moviespage.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Moviespage = ({render,Render}) => {
    const user=JSON.parse(localStorage.getItem('userInfo'))
    const token=user?.token
    const navigate=useNavigate()
    const [movies,setMovies]=useState('')
    useEffect(()=>{
        if(!user)navigate('/')
      },[])
    async function getallmovies(){
        try {
            const resp=await axios.get('https://imdbbackend12.onrender.com/movie/getallmovies',{
                headers:{
                    "access-token":token
                }
            })
            setMovies(resp.data.reverse())
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getallmovies()
    },[render])


    
  return (
    <div className='container'>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">
        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png' className='brand'/>
    </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        
      </ul>
      <button className='btn btn-outline-dark hb' onClick={()=>{
        navigate('/addmovie')
      }}>Add Movie</button>
      <button className='btn btn-outline-dark hb' onClick={()=>{
                  localStorage.removeItem('userInfo')
                  navigate('/')
              }}>Logout</button>

    </div>
  </div>
</nav>
     {movies!==''?<div className='moviescontainer'>
            {
                movies?.map((movie,index)=>(
                    <Movie movie={movie} key={index} Render={Render}/>
                ))
            }
        </div>:
        
        <div className='text-center'>
            <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        </div>
    }
        
        
    </div>
  )
}

export default Moviespage

function Movie({movie,Render}){
    const navigate=useNavigate()
    const movieid=movie._id
    const user=JSON.parse(localStorage.getItem('userInfo'))
    const token=user?.token
    async function handledelete(){
        try {
            const resp=await axios.delete('https://imdbbackend12.onrender.com/movie/delete',{
                headers: {
                    'access-token':token
                  },
                  data: {
                    movieid:movieid
                  }
            }
            ).then(x=>{
                Render()
            })
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <div className='moviecard'>
            <img src={movie.poster} className='movieimage'/>
            <i className="bi bi-pencil" onClick={()=>{
                navigate(`/editmovie/${movieid}`)
            }}></i>
            <i className="bi bi-trash-fill" onClick={handledelete}></i>
            <div className='titleinfo'>
                <span className='title'>{movie.name}</span>
                <span className='year'>({movie.yearofrelease})</span>
            </div>
            <div className='movieactors'>
                <span style={{fontWeight:'bold'}}>Cast: </span>
                {movie.actors.map((actor,index)=>(
                    <span key={index}>
                        <span className='movieactor' key={index}>{actor.name}</span>
                        {index!==movie.actors.length-1?<span>,</span>:'.'}
                    </span>
                ))}
            </div>
            <div style={{marginLeft:'10px',fontWeight:'bold'}}>Producer: <span className='producer'>{movie.producer.name}</span></div>
            <div className='movieplot'><span style={{fontWeight:'bold'}}>Plot: </span>{movie.plot}</div>
        </div>
    )
}