const express = require('express');
const app = express();
const moviesRouter = require ('./src/routes/moviesRouter')
const fileUpload = require('express-fileupload');

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.static("./public"))
app.use(fileUpload());

app.use ('/movies', moviesRouter)


app.listen(3000 , () => console.log('THE SERVER IS RUNNING AT 127.0.0.1:3000'));