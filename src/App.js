import React,{useState,useEffect} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {useHistory,Redirect,useLocation} from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import News from './Components/News';
import AddNews from './Components/AddNews';
import EditNews from './Components/EditNews';
import Edit from './Components/Edit';
import {db,auth} from './Components/firebase';
import Footer from './Components/Footer';
import Login from './Components/Login';

function App(props) {
  const history=useHistory();
  const location=useLocation();

  const [user,setUser]=useState("");

  const [addNews,setAddNews]=useState([]);

  const [category,setCategory]=useState([]);

  const [select,setSelect]=useState([])

  // const [search,setSearch]=useState('')
  // .filter((getNews)=>{
  //   if(location.state===undefined){
  //     return getNews
  //   }
  //   else if(getNews.title.toLowerCase().includes(location.state.toLowerCase())){
  //     return getNews
  //   }
  // })
    // console.log(props);
  useEffect(()=>{

    auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // No user is signed in.
        setUser('');
      }
    });

    db.collection("News").orderBy('id','desc').onSnapshot(snapshot=>{
     setAddNews(snapshot.docs.map(doc=>({
        id:doc.id,
        imageUrl:doc.data().imageUrl,
        newsLink:doc.data().newsLink,
        category:doc.data().category,
        title:doc.data().title,
        news:doc.data().news,
        timeStamp:doc.data().timeStamp
      })))
    })
  },[])

  const ReceiveNews=(createNews)=>{
    setAddNews((previousItems)=>{
      return [...previousItems,createNews];
    })
  }

  console.log('locations',location);
  console.log( 'searcho',history);

  console.log('add news',addNews);
  return (
    <Router>
      <div className="App">
      <Header id="header"/>
      <Switch>
      {user?(
        <>
        <Redirect from='/' to='/list'/>
        <Route path="/add">
          <div style={{height:'80px'}}>
          </div>
          <AddNews/>
        </Route>
        <Route path="/edit">
          <div style={{height:'80px'}}>
          </div>
          <Edit/>
        </Route>
        <Route path='/list'>
          <div style={{height:'80px'}}>
          </div>
          {
          addNews.map((getNews,i)=>{
          return <News
          key={i}
          id={getNews.id}
          imageUrl={getNews.imageUrl}
          showTitle={getNews.title}
          showNewsLink={getNews.newsLink}
          showNews={getNews.news}
          showCategory={getNews.category}
          showTimeStamp={getNews.timeStamp}
          url={location.search}
          />
        }
      )
    }
        </Route>
        </>
      ):(
        <Route path="/">
        <Header/>
        <div style={{height:'100px'}}>
        </div>
          <Login/>
        </Route>)}
      </Switch>
      <Footer/>
      </div>
    </Router>
  )

}

export default App;
export {AddNews};
