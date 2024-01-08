const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'https://tenis-para-todos.web.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://tenis-para-todos.web.app');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

//app.use(cors());
// Parsea el cuerpo de las solicitudes entrantes en formato JSON
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  // host: '127.0.0.1',
  // user: 'root',
  // password: '',
  // database: 'tenisparatodos'
  host: 'byfnn96wzcbaq9mubrn5-mysql.services.clever-cloud.com',
  user: 'ugckvzyrzlbchwpa',
  password: '2bbLU2oQfm3b8tnXVi5G',
  database: 'byfnn96wzcbaq9mubrn5'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

app.get("/", (req, res)=>{
  res.status(200).send({ msg: "Funciona la raiz" });
});


// Endpoint para obtener todos los usuarios
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users'; // Query para seleccionar todos los usuarios

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
      return;
    }

    res.json(results);
  });
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?'; // Consulta para obtener el usuario por su email

  connection.query(query, [email, password], (error, results) => {
    
    if(results.length === 0){
      //const resul = res.statusCode;
      res.json({ message: 'Error autenticación' });
    }else{
      const user = results[0];
      // Generar un token con JWT
      const token = jwt.sign({ user }, 'secreto_supersecreto', { expiresIn: '1h' });

      res.json({ message: 'Inicio de sesión exitoso', token, user });
    }
    
  });
  
});

