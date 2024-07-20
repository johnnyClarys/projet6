// Utilisez ce fichier pour gérer les configurations sensibles de l'application
// Pour générer une clé secrète sécurisée, décommentez les lignes suivantes :

// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(32).toString('hex');

// Assurez-vous que la clé secrète est définie dans les variables d'environnement
if (!process.env.SECRET_KEY) {
  process.exit(1); // Quitte le processus si la clé secrète n'est pas définie
}

module.exports = {
  secretKey: process.env.SECRET_KEY // Exporte la clé secrète depuis les variables d'environnement
};
