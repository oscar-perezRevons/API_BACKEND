require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Integración con Swagger UI con el Servidor Express
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Importa las rutas
const breedRoutes = require('./project-root/routes/breedRoutes');
const userRoutes = require('./project-root/routes/userRoutes');
const imageRoutes = require('./project-root/routes/imageRoutes');
const favouriteRoutes = require('./project-root/routes/favouriteRoutes');
const voteRoutes = require('./project-root/routes/voteRoutes');

// Rutas principales
app.get('/', (req, res) => {
    res.send(`
    <h2>¡Bienvenido a la API de Cat Social Network!</h2>
    <p>
      Usa la siguiente ruta para conocer más información sobre el enrutamiento de esta API:<br>
      <a href="http://localhost:3000/api-docs" target="_blank">http://localhost:3000/api-docs</a>
    </p>
  `);
});
app.use('/api/breeds', breedRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/votes', voteRoutes);

app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});