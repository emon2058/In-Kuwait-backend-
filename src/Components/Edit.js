import React, {
  useState,
  useEffect
} from 'react';
import './AddNews.css'
import breakingNews from "../Image/breakingNews.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@material-ui/core/Button';
import {
  db,
  timestamp
} from './firebase';
import {
  Link,
  useHistory,
  useParams
} from 'react-router-dom';
import S3 from './DigitalOcean';
import Config from './config'
import Swal from 'sweetalert2'

function Edit(props) {
  const history = useHistory();

  const {
    params
  } = useParams();

  let [blob, setBlob] = useState(null);

  // console.log('iiii');

  const news = history.location;
  // console.log(history);

  let [imageUrl, setImageUrl] = useState(news.imageUrl);

  const [selectCategories, setSelectCategories] = useState([]);
  console.log('sss');
  console.log(selectCategories);
  const d = new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const time = d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes() + ' ' + ((d.getHours() > 11) ? 'pm' : 'am');

  const [editNews, setEditNews] = useState({
    id: news.id,
    title: news.title,
    news: news.news,
    newsLink: news.newsLink,
    imageUrl: imageUrl,
    category: news.category,
    timestamp: time
  });

  useEffect(() => {
    db.collection("Categories").onSnapshot(snapshot => {
      setSelectCategories(snapshot.docs.map(doc => ({
        title: doc.data().title
      })))
    })
  }, [])


  const EventChange = (event) => {
    const {
      name,
      value
    } = event.target;
    setEditNews((previous) => {
      return {
        ...previous,
        [name]: value,
      }
    });
  }

  console.log('eee');
  console.log(editNews);

  const ImageHandler = (event) => {

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        console.log('reader.result and editNews');
        console.log(reader.result);
        setImageUrl(reader.result)
      }
    }

    reader.readAsDataURL(event.target.files[0]);
    setBlob(event.target.files[0]);
  }

  function uploadData() {

    db.collection("News").doc(editNews.id.toString()).set({
        id: parseInt(editNews.id),
        imageUrl: imageUrl,
        category: editNews.category,
        title: editNews.title,
        news: editNews.news,
        newsLink: editNews.newsLink,
        timeStamp: "Updated at " + time
      }).then(function() {
        console.log("uploaded");
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'News updated successfully',
          showConfirmButton: false,
          timer: 1200
        }).then((result) => {
          history.push('./list');
        });
      })
      .catch(function(error) {
        console.log("Got an error ", error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'News update failed',
          text: error,
          showConfirmButton: true,
        });
      });
  }

  const Update = (event) => {
    if ((editNews.title != '') && (editNews.news != '')) {
      Swal.showLoading();

      if (imageUrl != editNews.imageUrl) {
        const imageName = editNews.id + `.` + blob.name.split(".")[1];
        const params = {
          Body: blob,
          Bucket: `${Config.bucketName}`,
          Key: imageName
        };
        // Sending the file to the Spaces
        S3.putObject(params)
          .on('build', request => {
            request.httpRequest.headers.Host = `${Config.digitalOceanSpaces}`;
            request.httpRequest.headers['Content-Length'] = blob.size;
            request.httpRequest.headers['Content-Type'] = blob.type;
            request.httpRequest.headers['x-amz-acl'] = 'public-read';
          })
          .send((err) => {
            if (err) {
              console.log("ImageUploadingFailed");
              console.log(err);
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'News uploading failed',
                text: err,
                showConfirmButton: true,
              });
            } else {
              // If there is no error updating the editor with the imageUrl
              imageUrl = `${Config.digitalOceanSpaces}${Config.bucketName}/${imageName}`;
              console.log(imageUrl, blob.name, blob.type, blob.size);
              /// Uploading text details from here.
              uploadData();

            }
          })
      } else {
        uploadData();
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: "Fields can't be empty",
        confirmButtonColor: "#378afc",
      })
    }
  }
  return ( <
    div className = "AddNews" >
    <
    div className = "AddImage" >
    <
    div className = "SelectImage" >
    <
    input type = "file"
    name = "imageUrl"
    id = "Image"
    accept = "image/*"
    onChange = {
      ImageHandler
    }
    /> <
    img src = {
      imageUrl
    }
    className = "ImageBorder"
    onChange = {
      EventChange
    }
    /> <
    label htmlFor = "Image" >
    <
    p className = "Add" > Change Image < /p> < /
    label > <
    /div> < /
    div > <
    div className = "Form" >
    <
    form className = "row g-3" >
    <
    div className = "col-12" >
    <
    input type = "text"
    className = "form-control"
    id = "inputAddress"
    name = "title"
    value = {
      editNews.title
    }
    onChange = {
      EventChange
    }
    placeholder = "Title" / >
    <
    /div> <
    div className = "input-group" >
    <
    select className = "form-select Category"
    name = "category"
    onChange = {
      EventChange
    }
    id = "inputGroupSelect01" >
    <
    option value = {
      editNews.category
    } > {
      editNews.category
    } < /option> {
    selectCategories.map((categories) => {
        if (categories.title != news.category) {
          console.log(categories.title);
          return <option value = {
            categories.title
          } > {
            categories.title
          } < /option>}
        })
    } <
    /select> < /
    div > <
    div className = "input-group" >
    <
    input type = "text"
    className = "form-control"
    id = "inputAddress2"
    name = "newsLink"
    value = {
      editNews.newsLink
    }
    onChange = {
      EventChange
    }
    placeholder = "News link" / >
    <
    /div> <
    div className = "input-group" >
    <
    textarea cols = "10"
    rows = "6"
    className = "form-control"
    aria-label = "With textarea"
    name = "news"
    value = {
      editNews.news
    }
    onChange = {
      EventChange
    }
    placeholder = "News" > < /textarea> < /
    div > <
    div className = "input-group text-center d-flex justify-content-center" >
    <
    Button className = "Upload"
    onClick = {
      Update
    } > Update < /Button> < /
    div > <
    /form> < /
    div > <
    /div>

  )
}
export default Edit;
