import React,{useState} from 'react';
import './Header.css'
import {Link,useHistory} from 'react-router-dom';
import Logo from '../Image/logo.PNG';
import AddIcon from '@material-ui/icons/Add';
import ReorderIcon from '@material-ui/icons/Reorder';

function Header(props){
  return(
    <div className="Header">
      <Link to="/list">
        <div className="Left">
          <img className="Logo" src={Logo}/>
          <div className="LogoText">
            in Kuwait
          </div>
        </div>
      </Link>
      {/*<div class="col-6">
        <input type="text" class="form-control Search" id="inputAddress" placeholder="Search"/>
        <button><SearchIcon/></button>
      </div>}
      {/* <div className="Link">*/}
      <div className="Right">
        <div>
          <div className="input-group">
            <div className="form-outline">
              <input type="search" id="search" className="form-control Search" placeholder="Search" />
            </div>
            <i className="fas fa-search btn SearchIcon"></i>
            </div>
          </div>
        <div>
          <Link to="/list">
            <ReorderIcon/>
          </Link>
        </div>
        <div className="AddIcon">
          <Link to="/add">
            <AddIcon/>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header;
