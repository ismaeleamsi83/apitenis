const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//app.use(cors());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type, Authorization',
}));

const JWT_SECRET_KEY = "LA_CLAVE_SECRETA";



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

  //prueba
  
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
      const token = jwt.sign( {user} , JWT_SECRET_KEY, { expiresIn: '1h' });

      res.cookie("jwt", token);
      res.json({ message: 'Inicio de sesión exitoso', token, user });
    }
    
  });
  
});






//prueba FUNCIONA VERIFICAR TOKEN
function verifyToken(req, res, next) {
  console.log("adentro");
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provied" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    req.email = payload.email;
    console.log("aqui");
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}

app.get("/protected", verifyToken, (req, res) => {
  return res.status(200).json({ message: "You have access" });
});






// Registro
app.post('/register', (req, res) => {
  const { name, email, tel, password } = req.body;
  const INSERT_USER_QUERY = `INSERT INTO users (id, name, email, tel, password, discharge_date) VALUES (?, ?, ?, ?, ?, ?)`;

  const discharge_date = new Date();
  //const fechaFormateada = discharge_date.toISOString().slice(0, 19).replace('T', ' ');
  const userId = uuidv4();
  connection.query(INSERT_USER_QUERY, [userId, name, email, tel, password, discharge_date], (err, results) => {
    if (err) {
      console.error('Error registering user: ', err);
      res.status(500).json({ error: 'Could not register user' });
      return;
    }
    console.log('User registered successfully');
    res.status(201).json({ message: 'User registered successfully' });
  });
});