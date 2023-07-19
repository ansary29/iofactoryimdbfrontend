
import { useEffect, useState } from 'react'
import '../Css/Addmovie.css'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { Form, Formik, useFormik } from 'formik'
import { Button, TextField } from '@mui/material'
import axios from 'axios'
import Addactor from '../Components/Addactor'
import Addproducer from '../Components/Addproducer'

const Addmovie = () => {
    const navigate=useNavigate()
    const user=JSON.parse(localStorage.getItem('userInfo'))
    useEffect(()=>{
        if(!user)navigate('/')
      },[])
    const token=user?.token
    

    const [disp,setDisp]=useState('')
    const styles1={
        display:disp
    }
    const styles2={
        display:disp==''?'none':''
    }
    const [poster,setPoster]=useState()
    const [actors,setActors]=useState([])
    const [producers,setProducers]=useState([])
    const [actorIds,setActorIds]=useState([])
    const [producerId,setProducerId]=useState('')
    const [tags,setTags]=useState([])

    const initialValues={
        name:'',
        yearofrelease:'',
        plot:'',
        poster
    }
    const notifysuccess=()=> toast.success("Movie created successfully!")
    const notifyuserexist= () => toast.warning("Some error!")

    const onSubmit=(values)=>{
        values.poster=poster
        values.actors=actorIds
        values.producer=producerId
        async function create(){
            try {
                setDisp('none')
                await axios.post('https://imdbbackend12.onrender.com/movie/create',{
                ...values
            },{
                headers:{
                    "access-token":token
                }
            }).then(res=>{
                let movieId=res.data
                actorIds.map((x)=>{
                    updatecrew(movieId,x)
                })
                updatecrew(movieId,producerId)
                notifysuccess()
                setTimeout(() => {
                    navigate('/movies')
                }, 1000);
                setDisp('')
            })
            } catch (error) {
                notifyuserexist()
                setDisp('')
                console.log(error)
            }
           }
        async function updatecrew(movieId,crewId){
            try {
                await axios.put('https://imdbbackend12.onrender.com/crew/updatecrew',{
                    movieId,crewId
                },{
                    headers:{
                        "access-token":token
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
        create()

        }
  
    const validate=(values)=>{
        let errors={}
        if(!values.name)errors.name='Required*'
        if(!values.yearofrelease)errors.yearofrelease='Required*'
        if(!values.plot)errors.plot='Required*'
        return errors;
    }

    const formik=useFormik({
        initialValues,
        onSubmit,
        validate
    })

    function postpic(file){
        setDisp('none')
        if(file.type=='image/jpeg' || file.type=='image/png'){
            const data=new FormData()
            data.append('file',file)
            data.append('upload_preset','chat_app')
            data.append('cloud_name','likhithkumar')
            fetch('https://api.cloudinary.com/v1_1/likhithkumar/image/upload',{
                method:'post',
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
                setPoster(data.url)
                setDisp('')
            })
        }
        else{
            console.log('Invalid type')
        }
    }
    
    async function getactors(search){
        try {
            const resp=await axios.get('https://imdbbackend12.onrender.com/crew/getactors?search='+search,{
                headers:{
                    "access-token":token
                }
            })
            setActors(resp.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function getproducers(search){
        try {
            const resp=await axios.get('https://imdbbackend12.onrender.com/crew/getproducers?search='+search,{
                headers:{
                    "access-token":token
                }
            })
            setProducers(resp.data)
        } catch (error) {
            console.log(error)
        }
    }

    function setactorid(actorId){
        setActorIds([...actorIds,actorId])
    }

    

  return (
    <div>
        <div className="container-fluid registercont">
            <Formik>
            <Form onSubmit={formik.handleSubmit} className='form shadow'  >
                <div className="welcome">Add A Movie</div>
                <div className="inpbox">
                <TextField className='textinp' type={'text'} label='Enter Name' value={formik.values.firstname} name={'name'} onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth  ></TextField>
                    <div >{formik.errors.name && formik.touched.name?<div className="error">{formik.errors.name}</div>:null}</div>
                </div>
                <div className="inpbox">
                <TextField className='textinp' type={'number'} label='Enter The Year Of Release' value={formik.values.yearofrelease} name={'yearofrelease'} onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth  ></TextField>
                    <div >{formik.errors.yearofrelease && formik.touched.yearofrelease?<div className="error">{formik.errors.yearofrelease}</div>:null}</div>
                </div>
                <div className="inpbox">
                    <TextField className='textinp' variant="outlined" type={'text'} label={'Enter The Plot'} value={formik.values.plot} name='plot' onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth multiline maxRows={3}></TextField>
                    <div>{formik.errors.plot && formik.touched.plot?<div className="error">{formik.errors.plot}</div>:null}</div>
                </div>
                <div className='inpbox'>
                    <label>Upload The Movie Poster</label>
                    <input  type={'file'} accept='image/*' name='poster' onChange={e=>postpic(e.target.files[0])} onBlur={formik.handleBlur}></input>
                    <div className='error'>{formik.errors.poster && formik.touched.poster?<div className="error">{formik.errors.poster}</div>:null}</div>
                </div>
                <div className='inpbox addactors'>
                  {actors!==[] && <div className="dropdown">
                    <input className='dropdown-toggle sainput' type='text'  data-bs-toggle="dropdown" aria-expanded="false" onChange={(e)=>{getactors(e.target.value)}} placeholder='Search existing actors'/>
                    <span className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#exampleModal">Add new actor</span>
                    <Addactor/>
                    
                    <ul className="dropdown-menu scrollable-menu" >
                        {
                            actors.map((actor)=>(
                                <ActorItem actor={actor} setactorid={setactorid} key={actor._id} actorIds={actorIds} setTags={setTags} tags={tags}/>
                            ))
                        }
                    </ul>
                    </div>}
                </div>
                <div className='inpbox addactors'>
                  {producers!==[] && <div className="dropdown">
                    <input className='dropdown-toggle sainput' type='text'  data-bs-toggle="dropdown" aria-expanded="false" onChange={(e)=>{getproducers(e.target.value)}} placeholder='Search existing producers'/>
                    <span className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#exampleModal2">Add new producer</span>
                    <Addproducer/>
                    <ul className="dropdown-menu scrollable-menu" >
                        {
                            producers.map((producer)=>(
                                <ProducerItem producer={producer} setProducerId={setProducerId} key={producer._id} tags={tags} setTags={setTags} />
                            ))
                        }
                    </ul>
                    </div>}
                </div>
                <div className='inpbox tags'>
                     {tags?tags.map((tag,index)=>(
                        <Tagitem tag={tag} key={index} tags={tags} setTags={setTags} setActorIds={setActorIds} setProducerId={setProducerId}/>
                     )):''}
                </div>
                <Button variant='contained' type='submit' className="loginbtn b1" style={styles1}>Add Movie</Button>
                <Button variant="contained" className="loginbtn b2" type="button" style={styles2}>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                </Button>
                <Link to={'/movies'}>Home</Link>
            </Form>
            </Formik>
            <ToastContainer/>
        </div>
    </div>
  )
}

export default Addmovie

function ActorItem({actor,setactorid,actorIds,setTags,tags}){
    function handleclick(){
        if(actorIds.includes(actor._id))return
        setactorid(actor._id)
        setTags([...tags,actor])
    }
    return(
        <li onClick={handleclick}><a className="dropdown-item" href="#">{actor.name}</a></li>
    )
}

function Tagitem({tag,tags,setTags,setActorIds,setProducerId}){
    function handledelete(){
        if(tag.profession=='actor'){
            console.log('actor')
            let temptags=[],tempIds=[]
            tags.map(x=>{
                if(x._id!==tag._id){
                    temptags.push(x)
                    tempIds.push(x._id)
                }
            })
            setActorIds(tempIds)
            setTags(temptags)
        }
        else {
            setProducerId('')
            let temptags=[]
            tags.map(x=>{
                if(x._id!==tag._id){
                    temptags.push(x)
                }
            })
            setTags(temptags)
        }
    }
    return(
        <div className='tag'>
            <span>{tag.name}</span>
            <i className="bi bi-x-circle" onClick={handledelete}></i>
        </div>
    )
}

function ProducerItem({producer,setProducerId,setTags,tags}){
    function handleclick(){
        let bool=false
        tags.map(x=>{
            if(x.profession=='producer')bool=true
        })
        if(bool==true)return
        setProducerId(producer._id)
        setTags([...tags,producer])
    }
    return(
        <li onClick={handleclick}><a className="dropdown-item" href="#">{producer.name}</a></li>
    )
}

