const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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

app.get('/api/usuarios/:email', (req, res) => {
  const userId = req.params.email;
  const query = 'SELECT * FROM users WHERE email = ?'; // Query para seleccionar un usuario por su ID

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ error: 'Error al obtener el usuario' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(results[0]); // Devuelve el primer usuario encontrado (debería ser solo uno)
  });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?'; // Consulta para obtener el usuario por su email

  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ error: 'Error al obtener el usuario' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const user = results[0];

    // Aquí deberías comparar la contraseña encriptada almacenada en la base de datos con la contraseña proporcionada por el usuario
    if (user.password !== password) {
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    res.json({ message: 'Inicio de sesión exitoso', user });
  });
});

