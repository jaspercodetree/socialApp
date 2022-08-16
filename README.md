<p align="center" dir="auto">
  <a href="https://jasperbook.herokuapp.com" rel="nofollow">
    <img src="https://i.imgur.com/4dnSRTr.png" alt="logo" width="72" height="72" style="max-width: 100%;">
  </a>
</p>

<h3 align="center" dir="auto">JasperBook</h3>
<p align="center" dir="auto">
 Online platform for everyone to readily share your life, make friends, and interact with others all over the world. It mimics the functionality and interface of Facebook. You can browse JasperBook on your computer or cellphone.
 <br/>
 <a href="https://jasperbook.herokuapp.com" rel="nofollow"><strong>Explore my Website</strong></a>
 <br/>
 <h3 align="center" dir="auto">mobile link</h3>
 <p align="center" dir="auto">
   <img src="https://i.imgur.com/Cq8bYzs.png" alt="logo" width="100" height="100" style="max-width: 100%;">
</p>
</p>

## **Table of contents**

- [App first look](https://github.com/jaspercodetree/socialApp#app-first-look)
- [About JasperBook project](https://github.com/jaspercodetree/socialApp#about-jasperbook-project)
- [How to use](https://github.com/jaspercodetree/socialApp#how-to-use)
- [API Document](https://github.com/jaspercodetree/socialApp#api-document)
- [Upcoming features](https://github.com/jaspercodetree/socialApp#upcoming-features)
## **App first look**

### **User Interface**

![Untitled]("https://i.imgur.com/4dnSRTr.png)

### **board**

## **About JasperBook project**

Online platform for everyone to readily share your life, make friends, and interact with others all over the world.

### **MERN stack**

- MongoDB — document database
- Express(.js) — Node.js web framework
- React(.js) — a client-side JavaScript framework
- Node(.js) — the premier JavaScript web server

### **Open source kits and API we have used**

**Front End**

- Using [React](https://reactjs.org/) as the front-end framework
- Using [axios](https://axios-http.com/) to help connect front-end to back-end
- Using [jwt-decode](https://github.com/auth0/jwt-decode#readme) to helps decoding JWTs token which are Base64Url encoded.
- Using [Sass](https://github.com/sass/node-sass), CSS preprocessors, in the project. Making CSS code cleaner and reusable.
- Using [Bootstrap 5](https://getbootstrap.com/) CSS framework to help create responsive front-end website
- Using [timeago](https://www.npmjs.com/package/timeago.js/v/4.0.0-beta.3) to parse, validate and display date and time that are consistent with back-end
- Using [material-ui](https://mui.com/zh/) to display beautiful icons on the website

**Back End**

- Using [Express](http://expressjs.com/) as web framework for Node.js.
- Using [Helmet](https://helmetjs.github.io/) to help secure Express apps by setting various HTTP headers
- Using [Mongoose](https://mongoosejs.com/) to help writing MongoDB validation, casting and business logic
- Using [morgan](https://github.com/expressjs/morgan#readme) as HTTP request logger middleware for node.js
- Using [JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken) to add token based authentication to RESTful API
- Using [Multer](https://github.com/expressjs/multer) for file upload feature
- Using [bcryptjs](https://github.com/dcodeIO/bcrypt.js) to hash and check password
- Using [dotenv](https://github.com/motdotla/dotenv) to help load the environment variables saved in .env file

## **How to use**

**Sign up & login**

- Sign up for a JasperBook account to start the journey
- Log in to your JasperBook  user account
    
    Or you can use the sample account to quickly log in
    
    - email: takeshi@example.com
    - password: jasper

**Timeline main page**

- The left column is the user account that is recommended to be added as a friend
- The right column is the friends you have
- The middle column is your own and all your friends' articles
- If you are a newly registered user, Jasper will be the default friend of everyone.
- You can search for users by entering keywords on the top of navbar.

**Post your first post**

- Write a paragraph
- Choose a photo
- Tag a user
- And show the current mood, press the share button !
- Then you can see your new post with the time it was posted
- You only can edit or delete your post

**Respond to others**

- You can press the love button to like someone else's post
- You can respond by commenting below the post
- You can see the name and time of the message
- You can edit or delete your own message

**Personal page**

- By clicking on the person's name or photo, you can visit each person's personal page
- The middle column here will only have each person's own article
- If you log in to your personal page, you can also post a message directly at the top of it
- The right column is the basic information for each person.
- What's more special is that Jasper's page has records of my work and professional skills

**Edit personal info**

- Click on your photo of the navbar. And click the edit profile button.
- You can update your personal info
- Upload your avatar
- Upload your cover photo

PS: The advertising site on the right is where I have volunteered for many years.

## **API Document**

JasperBook app is using our own REST APIs. To learn more about the API, please check out my [API Docs](https://documenter.getpostman.com/view/13211824/VUjQm4Vb#c9ea10c6-39fc-42b0-9a81-71df68e4139d) for more information.

### **What's included**

Within the API document you will find the following directories and files:

```
dist/
├── auth/
│   ├── register
│   ├── login
│   ├── postRefreshToken
└── users/
│   ├── putUser
│   ├── getUser
│   ├── getAllUsers
│   ├── getRecommendUsers
│   ├── searchUsers
│   ├── followUser
│   ├── unfollowUser
│   ├── getFriends
└── posts/
│   ├── postPost
│   ├── getPost
│   ├── putPost
│   ├── deletePost
│   ├── postLikeDislike
│   ├── getTimeline
│   ├── getPersonalPost
│   ├── postComment
│   ├── putComment
│   ├── deleteComment
└── upload/
    ├── postPostImage
    ├── postPersonalImage
    └── postDeleteImage
```

## **Upcoming features**

- Build a website to improve web page fluency
- User can updates or resets password
- Online chat with friends
- Posting can mark the location
