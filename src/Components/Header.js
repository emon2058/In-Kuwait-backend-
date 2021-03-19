import React,{useState} from 'react';
import './Header.css'
import {Link,useHistory} from 'react-router-dom';
import Logo from '../Image/logo.PNG';
import AddIcon from '@material-ui/icons/Add';
import ReorderIcon from '@material-ui/icons/Reorder';

function Header(){
  const history=useHistory();
  const [search,setSearch]=useState('');

  const EventChange=(event)=>{
    setSearch(event.target.value,
      history.push({pathname: '/list', search: '?'+event.target.value, state:event.target.value})
    );
    // history.push({pathname: '/list', search: '?'+search, state:search});
  }

  console.log("ses" +search);

  const Search=()=>{
    history.push({pathname: '/list', search: '?'+search, state:search});
  }

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
        <div>{/*
          <label htmlFor="header-search">
          <span className="visually-hidden">Search blog posts</span>
          </label>
          <input
          type="text"
          id="header-search"
          placeholder="Search blog posts"
          name="s"
          />
          <button type="submit">Search</button>
          */}

          <div className="input-group">
            <div className="form-outline">
              <input type="search" id="search" className="form-control Search" placeholder="Search" value={search} onChange={EventChange}/>
            </div>
            <i className="fas fa-search btn SearchIcon" onClick={Search}></i>
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
