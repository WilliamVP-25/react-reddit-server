const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const bodyParser = require('body-parser');

const app = express(); //create server
connectDB(); //connect db
const optionsCors = {origin: process.env.FRONTEND_URL}
app.use(cors(optionsCors)); //enable cors

app.use(express.json({extended: true})); //enable express.json
const port = process.env.PORT || 4000; //port env | default

//habilitar carpeta public uploads /fileURL
app.use(express.static('uploads'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

/*app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))*/

//routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/posts', require('./routes/posts'));

app.listen(port, '0.0.0.0', () => {//run app
    console.log(`El servidor esta funcionando con el puerto ${port}`);
});