require('dotenv').config(); // Charge les variables d'environnement depuis un fichier .env
const http = require('http'); // Module pour créer un serveur HTTP
const app = require('./app'); // Importation de l'application Express

// Fonction pour normaliser un port en nombre, chaîne de caractères, ou false
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val; // Retourne la valeur si ce n'est pas un nombre
  }
  if (port >= 0) {
    return port; // Retourne le port s'il est un nombre positif ou zéro
  }
  return false; // Retourne false pour les valeurs invalides
};

// Récupère le port depuis les variables d'environnement ou utilise 3000 par défaut
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // Définit le port dans l'application Express

// Fonction pour gérer les erreurs spécifiques lors de l'écoute avec des messages
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error; // Lance une erreur si le problème n'est pas lié à l'écoute
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' nécessite des privilèges élevés.'); // Erreur de permissions
      process.exit(1); // Quitte le processus avec un code d'échec
      break;
    case 'EADDRINUSE':
      console.error(bind + ' est déjà utilisé.'); // Erreur d'adresse déjà utilisée
      process.exit(1); // Quitte le processus avec un code d'échec
      break;
    default:
      throw error; // Lance une erreur pour les autres codes d'erreur
  }
};

// Crée un serveur HTTP
const server = http.createServer(app);

server.on('error', errorHandler); // Gère les erreurs lors de l'écoute
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Affiche le port ou le canal sur lequel le serveur écoute
});

// Démarre le serveur et écoute sur le port spécifié
server.listen(port);
