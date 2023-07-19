import React, { useState } from 'react'
import '../Css/Login.css'
import { Form, Formik, useFormik } from 'formik'
import { Button, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
const Login = () => {
    const navigate=useNavigate()

    const initialValues={
        email:'',
        password:''
      }
    
    const [disp,setDisp]=useState('')
    
    const styles1={
    display:disp
    }
    const styles2={
    display:disp==''?'none':''
    }
    
    const notifysuccess=()=> toast.success("Login Successfull!")
    const notifyinvalid= () => toast.error("Invalid Email or Password!")
    
    const onSubmit=(values)=>{
    async function signin(){
        try {
            setDisp('none')
            await axios.post('https://imdbbackend12.onrender.com/users/signin',{
            ...values
        }).then(res=>{
            localStorage.setItem('userInfo',JSON.stringify(res.data))
            notifysuccess()
            setTimeout(() => {
                navigate('/movies')
            }, 1000);
            setDisp('')
        })
        } catch (error) {
            notifyinvalid()
            setDisp('')
            console.log(error)
        }
    }
    signin()
    }
    
      
    
      const validate=(values)=>{
        let errors={}
        if(!values.email)errors.email='required*'
        if(!values.password)errors.password='required*'
        return errors;
      }
    
      const formik=useFormik({
        initialValues,
        onSubmit,
        validate
      })
      
  return (
    <div>
        <div className="container-fluid registercont">
        <Formik>
          <Form onSubmit={formik.handleSubmit} className='form shadow'  >
              <div className="welcome">Log in</div>
              <div className="inpbox">
              <TextField className='textinp' type={'email'} label='Enter Email' value={formik.values.email} name={'email'} onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth  ></TextField>
                <div >{formik.errors.email && formik.touched.email?<div className="error">{formik.errors.email}</div>:null}</div>
              </div>
              <div className="inpbox">
                <TextField className='textinp' variant="outlined" type={'password'} label={'Enter Password'} value={formik.values.password} name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth></TextField>
                <div>{formik.errors.password && formik.touched.password?<div  className="error">{formik.errors.password}</div>:null}</div>
              </div>
              <Button variant='contained' type='submit' className="loginbtn b1" style={styles1}>Login</Button>
              <Button variant="contained" className="loginbtn b2" type="button" style={styles2}>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
              </Button>
              <div>Don't have an account? <Link to={'/signup'}>Sign up</Link></div>
           
          </Form>
        </Formik>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Login