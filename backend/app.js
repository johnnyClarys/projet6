const express = require('express');
const path = require('path');
const connectDB = require('./db'); // Fonction pour se connecter à la base de données MongoDB
const corsConfig = require('./corsConfig'); // Configuration des en-têtes CORS
const bookRoutes = require('./routes/book'); // Routes pour les livres
const userRoutes = require('./routes/user'); // Routes pour les utilisateurs
const app = express(); // Création de l'application Express



require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env
const jwt = require('jsonwebtoken'); // Importe le module jsonwebtoken
const secretKey = process.env.SECRET_KEY; // Récupère la clé secrète depuis les variables d'environnement
if (!secretKey) {
  console.error('SECRET_KEY is not defined'); // Affiche une erreur si la clé secrète n'est pas définie
  process.exit(1); // Quitte le processus si la clé secrète n'est pas définie
}
const payload = { userId: 123, username: 'exampleUser' }; // Charge utile du jeton
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Génère un jeton JWT avec une expiration d'une heure
console.log('Generated Token:', token); // Affiche le jeton généré
const tokenToVerify = token; // Jeton à vérifier
try {
  const decoded = jwt.verify(tokenToVerify, secretKey); // Vérifie et décode le jeton
  console.log('Decoded Token:', decoded); // Affiche le jeton décodé
} catch (err) {
  console.error('Invalid Token:', err.message); // Affiche une erreur si le jeton est invalide
}


// Connexion à MongoDB
connectDB();

// Middleware pour la gestion des en-têtes CORS
app.use(corsConfig);

// Middleware pour analyser les corps de requêtes JSON
app.use(express.json());

// Routes pour les API
app.use('./routes/book', bookRoutes); // Routes pour les livres
app.use('./routes/user', userRoutes);  // Routes pour l'authentification des utilisateurs

// Route pour servir les images statiques depuis le dossier 'images'
app.use('../src/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application Express pour l'utiliser dans le serveur principal
module.exports = app;
