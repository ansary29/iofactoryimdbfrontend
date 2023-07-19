import { Button, TextField } from '@mui/material'
import axios from 'axios'
import { Form, Formik, useFormik } from 'formik'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'


const Signup = () => {
    const navigate=useNavigate()

    const [disp,setDisp]=useState('')
    const styles1={
        display:disp
    }
    const styles2={
        display:disp==''?'none':''
    }

    const initialValues={
        name:'',
        email:'',
        password:'',
        confirmpassword:''
    }
    const notifysuccess=()=> toast.success("Registration Successfull!")
    const notifyuserexist= () => toast.warning("User Already Exists!")

    const onSubmit=(values)=>{
        async function signup(){
            try {
                setDisp('none')
                await axios.post('https://imdbbackend12.onrender.com/users/signup',{
                ...values
            }).then(res=>{
                notifysuccess()
                setTimeout(() => {
                    navigate('/')
                }, 1000);
                setDisp('')
            })
            } catch (error) {
                notifyuserexist()
                setDisp('')
                console.log(error)
            }
           }
           signup()
        }
  
    const validate=(values)=>{
        let errors={}
        if(!values.name)errors.name='Required*'
        if(!values.email)errors.email='Required*'
        if(!values.password)errors.password='Required*'
        if(!values.confirmpassword)errors.confirmpassword='Required*'
        if(values.password!=values.confirmpassword)errors.confirmpassword="Password didn't matched!"
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
                <div className="welcome">Sign up</div>
                <div className="inpbox">
                <TextField className='textinp' type={'text'} label='Enter Name' value={formik.values.firstname} name={'name'} onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth  ></TextField>
                    <div >{formik.errors.name && formik.touched.name?<div className="error">{formik.errors.name}</div>:null}</div>
                </div>
                <div className="inpbox">
                <TextField className='textinp' type={'email'} label='Enter Email' value={formik.values.email} name={'email'} onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth  ></TextField>
                    <div >{formik.errors.email && formik.touched.email?<div className="error">{formik.errors.email}</div>:null}</div>
                </div>
                <div className="inpbox">
                    <TextField className='textinp' variant="outlined" type={'password'} label={'Enter Password'} value={formik.values.password} name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth></TextField>
                    <div>{formik.errors.password && formik.touched.password?<div className="error">{formik.errors.password}</div>:null}</div>
                </div>
                <div className="inpbox">
                    <TextField className='textinp' variant="outlined" type={'password'} label={'Confirm Password'} value={formik.values.confirmpassword} name='confirmpassword' onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth></TextField>
                    <div>{formik.errors.confirmpassword && formik.touched.confirmpassword?<div className="error">{formik.errors.confirmpassword}</div>:null}</div>
                </div>
                <Button variant='contained' type='submit' className="loginbtn b1" style={styles1}>Signup</Button>
                <Button variant="contained" className="loginbtn b2" type="button" style={styles2}>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                </Button>
                <div>Already have an account? <Link to={'/'}>Login</Link></div>
            </Form>
            </Formik>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default Signup