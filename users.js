const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const app = express();
const PORT = 3000;

app.use(cors());
// Parsea el cuerpo de las solicitudes entrantes en formato JSON
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tenisparatodos' // Nombre de tu base de datos
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


// Endpoint para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
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

