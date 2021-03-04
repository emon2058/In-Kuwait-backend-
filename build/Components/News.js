import React,{useEffect,useState} from 'react';
import './News.css';
import breakingNews from "../Image/breakingNews.jpg";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {db} from './firebase';
import Swal from 'sweetalert2'
import {Link,useHistory,useLocation} from 'react-router-dom';
import S3 from './DigitalOcean';
import AWS from 'aws-sdk';

function News(props){
  const location=useLocation();

  const [editNews,setEditNews]=useState({
    id:props.id,
    title:props.showTitle,
    news:props.showNews,
    newsLink:props.showNewsLink,
    imageUrl:props.imageUrl,
    category:props.showCategory
  });

  const history=useHistory();

  const Deleted=(event)=>{
        Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0cff00',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) =>  {
      if (result.isConfirmed) {
        console.log(props.id);
        Swal.showLoading();
  await db.collection('News').doc(props.id).delete();
    const key = editNews.imageUrl.replace("https://glow-data-storage.fra1.digitaloceanspaces.com/", "");
    console.log(key);
              // Add a file to a Space
    const END_POINT = "fra1.digitaloceanspaces.com";
    const SPACE_ACCESS_TOKEN="3PJRQW5WYUOHR3UDAPCS"
    const SPACE_SECRET="mzBAvFa2dLTdEn6KR0quEP9s4xtmxARmVHPnEBFJ7F0"
    const spacesEndpoint = new AWS.Endpoint(END_POINT);

    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: SPACE_ACCESS_TOKEN,
        secretAccessKey: SPACE_SECRET
    });
              s3.deleteObject({
                  Bucket: "glow-data-storage",
                  Key: key
              }, (err, data) => {
                  if (err) {
                      console.log(err, err.stack)
                        Swal.fire({
                          title: 'Failed!',
                          icon: 'error',
                          text: err,
                          showConfirmButton: true,
                        }).then((result) => {
                          // window.location.reload();
                        });
                  } else {
                      console.log(data)
                        Swal.fire({
                          title: 'Deleted!',
                          icon: 'success',
                          showConfirmButton: false,
                          timer: 1500
                        }).then((result) => {
                          window.location.reload();
                        });
                  }
              });

      }
  })
  }
  const EventChange=(event)=>{
    const {name,value}=event.target;
    setEditNews((previous)=>{
      return{
        ...previous,
        [name]:value,
      }
    });
  }

  const Edit=()=>{
    history.push({pathname: '/edit', search: '?query=abc', state: editNews});
  }
  return(
      <div className="Container">
        <div>
            <div className="Image">
                <img className="NewsImage" src={props.imageUrl}/>
                <div className="SideOptionsInImage">
                  <button type="button" className="btn">
                    <i className="fas fa-trash Delete" onClick={Deleted}></i>
                  </button>
                  <button type="button" className="btn">
                    <Link to={{
                        pathname: '/edit',
                        id: editNews.id,
                        title: editNews.title,
                        news: editNews.news,
                        newsLink:editNews.newsLink,
                        category:editNews.category,
                        imageUrl:editNews.imageUrl,
                      }} className="editButton">
                      <i className="fas fa-edit Edit"></i>
                    </Link>
                  </button>
                </div>
            </div>
        </div>
        <div className="NewsBorder">
            <div className="NewsAndDate">
              <div>
                <h1 className="NewsTitle">{props.showTitle}</h1>
                <p className="NewsPara">{props.showNews}</p>
              </div>
              <div className="Published">
                 {props.showTimeStamp}
              </div>
            </div>
            <div className="SideOptions">
              <button type="button" className="btn">
                <i className="fas fa-trash Delete" onClick={Deleted}></i>
              </button>
               <button type="button" className="btn">
                <Link to={{
                  pathname: '/edit',
                  id: editNews.id,
                  title: editNews.title,
                  news: editNews.news,
                  newsLink:editNews.newsLink,
                  category:editNews.category,
                  imageUrl:editNews.imageUrl,
                }} className="editButton">
                <i className="fas fa-edit Edit"></i>
              </Link>
            </button>
          </div>
        </div>
      </div>
  )
}

export default News;
