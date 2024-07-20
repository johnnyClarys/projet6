const cors = (req, res, next) => {
  // Définit les en-têtes pour permettre les requêtes CORS (Cross-Origin Resource Sharing)
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines à accéder aux ressources
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Spécifie les en-têtes autorisés dans les requêtes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Spécifie les méthodes HTTP autorisées
  next(); // Passe au middleware suivant
};

module.exports = cors; // Exporte le middleware CORS pour l'utiliser dans l'application Express
