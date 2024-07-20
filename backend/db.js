const mongoose = require('mongoose');

// Fonction pour se connecter à la base de données MongoDB
const connectDB = async () => {
  try {
    // Essaye de se connecter à la base de données MongoDB avec les informations d'identification et l'URL
    await mongoose.connect(`mongodb+srv://${process.env.DB_ID}:${process.env.DB_PWD}@${process.env.DB_URL}`, {
      useNewUrlParser: true, // Utilise le nouveau parser d'URL pour les connexions MongoDB
      useUnifiedTopology: true // Utilise le moteur de topologie unifié pour la gestion des connexions
    });

  } catch (error) {
    // Si une erreur survient lors de la connexion, quitte le processus avec un code d'échec
    process.exit(1);
  }
};

// Exporte la fonction connectDB pour l'utiliser dans d'autres parties de l'application
module.exports = connectDB;
