import React,{useState} from 'react';
import './Login.css';
import Logo from '../Image/logo.PNG';
import {Link,useHistory} from 'react-router-dom';
import {auth} from './firebase';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2'

function Login(){
  const history=useHistory();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  {/*Sign In with firebase*/}
  const signIn = e =>{
    Swal.showLoading();
    {/*When click singIn button this page update without refresh*/}
    e.preventDefault();
    auth.signInWithEmailAndPassword(email,password).then(auth=>{
        history.push('/list');

        Swal.fire({
          position: 'center',
          icon: 'success',
          // title: 'Your work has been saved',
          // showConfirmButton: false,
          timer: 1500
        });
      })
        .catch(error =>
                Swal.fire({
                  title: error.message,
                  position: 'center',
                  icon: 'error',
                  // title: 'Your work has been saved',
                  showConfirmButton: true,
                  confirmButtonColor: "#378afc",

                }),)
      }
  return(
    <div className="Login">
      <div className="login_conatainer">
        <div className="LogoCenter">
          <img src={Logo} className="LogoInLogin"/>
        </div>
        <form className="row g-3">
          <div className="col-12">
            <input type="email" className="form-control" id="inputAddress" name="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="email"/>
          </div>
          <div className="input-group">
            <input type="password" className="form-control" id="inputAddress2" name="password" value={password} onChange={event=>setPassword(event.target.value)}  placeholder="password"/>
          </div><br/>
          <div className="input-group  Center">
            <Button className="SignIn" onClick={signIn} >Sign In</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
