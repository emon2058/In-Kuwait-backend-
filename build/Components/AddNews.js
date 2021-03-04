import React,{useState,useEffect} from 'react';
import './AddNews.css'
import breakingNews from "../Image/breakingNews.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@material-ui/core/Button';
import {db,timestamp} from './firebase';
import {Link,useHistory} from 'react-router-dom';
import Swal from 'sweetalert2'
import defaultNewsImage from '../Image/defaultNewsImage.png';
import S3 from './DigitalOcean';
import Config from './config'
import firebase from 'firebase';

function AddNews(){
  const history=useHistory();

  let [imageUrl,setImageUrl]=useState(defaultNewsImage);
  let [blob, setBlob] = useState(null);

  const[selectCategories,setSelectCategories]=useState([]);

  console.log('props');
  console.log(setSelectCategories);

  const d=new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const time=d.getDate()+' '+months[d.getMonth()]+', '+d.getFullYear()+' at '+d.getHours()+':'+d.getMinutes();

  let id=Date.now();

  const [createNews,setCreateNews]=useState({
    id:id,
    imageUrl:imageUrl,
    category:selectCategories,
    title:'',
    news:'',
    newsLink:''
  });

  useEffect(()=>{
        db.collection("Categories").onSnapshot(snapshot=>{
         setSelectCategories(snapshot.docs.map(doc=>({
           title:doc.data().title
         })))
       })
     },[])

    const EventChange=(event)=>{
    const {name,value}=event.target;
    setCreateNews((previous)=>{
      return{
        ...previous,
        [name]:value,
      }
    });
  }

  const HandleImage=(e) => {
    if (e.target.files && e.target.files[0]) {
      const reader=new FileReader();
      reader.onload=()=>{
        if(reader.readyState===2){
            setImageUrl(reader.result)
          }
        }
    reader.readAsDataURL(e.target.files[0]);
      setBlob(e.target.files[0]);
    }
};
console.log("blob");
console.log(createNews);
  console.log(blob);

  const Upload=(event)=>{
    if((createNews.title!='') && (createNews.news!='') && (imageUrl != defaultNewsImage)){
      Swal.showLoading();
      ///
      const imageName = id + `.` + blob.name.split(".")[1];
      const params = { Body: blob,
                       Bucket: `${Config.bucketName}`,
                       Key: imageName};
       // Sending the file to the Spaces
       console.log(imageName);
       S3.putObject(params)
         .on('build', request => {
           request.httpRequest.headers.Host = `${Config.digitalOceanSpaces}`;
           request.httpRequest.headers['Content-Length'] = blob.size;
           request.httpRequest.headers['Content-Type'] = blob.type;
           request.httpRequest.headers['x-amz-acl'] = 'public-read';
        })
        .send((err) => {
          if (err){ console.log("ImageUploadingFailed");
          console.log(err);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'News uploading failed',
              text: err,
              showConfirmButton: true,
            });
          }
          else {
          // If there is no error updating the editor with the imageUrl
          imageUrl = `${Config.digitalOceanSpaces}${Config.bucketName}/${imageName}`;
          console.log(imageUrl, blob.name, blob.type, blob.size);
          /// Uploading text details from here.

                db.collection("News").doc(createNews.id.toString()).set({
                  id:parseInt(createNews.id),
                  imageUrl:imageUrl,
                  category:createNews.category,
                  title:createNews.title,
                  news:createNews.news,
                  newsLink:createNews.newsLink,
                  timeStamp:"Published on "+ time
                }).then(function () {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'News uploaded successfully',
                    showConfirmButton: false,
                    timer: 1200
                  }).then((result) => {
                    history.push('./list');
                  });
                })
                .catch(function (error) {
                  console.log("Got an error ", error);
                    Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: 'News uploading failed',
                      text: error,
                      showConfirmButton: true,
                    });
                });
         }
      });
    } else{
      Swal.fire({
        icon: 'error',
        title: "Fields can't be empty",
        confirmButtonColor: "#378afc",
      })
    }
  }
  return(
    <div className="AddNews">
      <div className="AddImage">
        <div className="SelectImage">
          <input type="file" name="imageUrl" id="Image" accept="image/*"  onChange={HandleImage}/>
          <img src={imageUrl} className="ImageBorder" onChange={EventChange}/>
          <label htmlFor="Image">
            <p className="Add">Add Image</p>
          </label>
        </div>
      </div>
      <div className="Form">
        <form className="row g-3">
          <div className="col-12">
            <input type="text" className="form-control" id="inputAddress" name="title" value={createNews.title} onChange={EventChange} placeholder="Title"/>
          </div>
          <div className="input-group">
          <select className="form-select Category" name="category" id="inputGroupSelect01"  onChange={EventChange}>
            <option>Choose Category</option>
              {
                selectCategories.map((categories)=>{
                  console.log(categories.title);
                return <option value={categories.title}>{categories.title}</option>
              })
            }
            </select>
          </div>
          <div className="input-group">
            <input type="text" className="form-control" id="inputAddress2" name="newsLink" value={createNews.newsLink} onChange={EventChange} placeholder="News link"/>
          </div>
          <div className="input-group">
            <textarea cols="10" rows="6" className="form-control" aria-label="With textarea" name="news" value={createNews.news} onChange={EventChange} placeholder="News"></textarea>
          </div>
          <div className="input-group text-center d-flex justify-content-center">
            <Button className="Upload" onClick={Upload} >Upload</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddNews;
