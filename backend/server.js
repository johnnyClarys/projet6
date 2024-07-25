const http = require('node:http');
const app = require('./app');

// Définir le port sur lequel le serveur va écouter
const port = process.env.PORT || 3000;
app.set('port', port);

// Créer le serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Démarrer le serveur et écouter sur le port défini

server.listen(process.env.PORT || 3000);