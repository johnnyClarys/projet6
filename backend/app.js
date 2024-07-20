const express = require('express');
const path = require('path');
const connectDB = require('./db'); // Fonction pour se connecter à la base de données MongoDB
const corsConfig = require('./corsConfig'); // Configuration des en-têtes CORS

const bookRoutes = require('./routes/book'); // Routes pour les livres
const userRoutes = require('./routes/user'); // Routes pour les utilisateurs

const app = express(); // Création de l'application Express

// Connexion à MongoDB
connectDB();

// Middleware pour la gestion des en-têtes CORS
app.use(corsConfig);

// Middleware pour analyser les corps de requêtes JSON
app.use(express.json());

// Routes pour les API
app.use('/api/books', bookRoutes); // Routes pour les livres
app.use('/api/auth', userRoutes);  // Routes pour l'authentification des utilisateurs

// Route pour servir les images statiques depuis le dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application Express pour l'utiliser dans le serveur principal
module.exports = app;
