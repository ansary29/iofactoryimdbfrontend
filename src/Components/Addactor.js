import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Addactor = () => {

    const user=JSON.parse(localStorage.getItem('userInfo'))
    const token=user?.token
    const navigate=useNavigate()
    useEffect(()=>{
        if(!user)navigate('/')
      })
    const [disp,setDisp]=useState('')
    const styles1={
        display:disp
    }
    const styles2={
        display:disp==''?'none':''
    }
    const [name,setName]=useState('')
    const [dob,setDob]=useState('')
    const [gender,setGender]=useState('')
    const [bio,setBio]=useState('')
    
    const notifyaddingproducer=()=> toast.success("Search for added actor!")
    async function addActor(){
        try {
            setDisp('none')
            await axios.post('https://imdbbackend12.onrender.com/crew/createactor',{
            name,dob,bio,gender
        },{
            headers:{
                "access-token":token
            }
        }).then(res=>{
            setName('')
            setBio('')
            setDob('')
            setGender('')
            notifyaddingproducer()
            setTimeout(() => {
                navigate('/addmovie')
            }, 1000);
            setDisp('')
        })
        } catch (error) {
            setDisp('')
            console.log(error)
        }
    }
  return (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add new actor</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            
                            <div className='inputbox'>
                                <label>Name</label>
                               <input type='text' className='minput' onChange={(e)=>{setName(e.target.value)}}/>
                            </div>
                            <div className='inputbox'>
                                <label>DOB</label>
                               <input type='date' className='minput' onChange={(e)=>{setDob(e.target.value)}}/>
                            </div>
                            <div className='inputbox gender'>
                                <label>Gender</label>
                               <input type="radio" name="gender" value="male" className='minput' onClick={(e)=>{setGender(e.target.value)}}/>  Male
                              <input type="radio" name="gender" value="female" className='minput' onClick={(e)=>{setGender(e.target.value)}}/>  Female
                            </div>
                            <div className='inputbox'>
                                <label>Bio</label>
                               <textarea rows={4} className='minput' onChange={(e)=>{setBio(e.target.value)}}/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {(name=='' || bio=='' || dob=='' || gender=='')?'':<button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addActor} style={styles1}>Add</button>}
                            <button  className="loginbtn b2" type="button" style={styles2}>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>

                        </div>
                        </div>
                    </div>
                    </div>
  )
}

export default Addactor