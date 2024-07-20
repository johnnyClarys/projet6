const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma d'utilisateur pour Mongoose
const userSchema = mongoose.Schema({
  // Adresse email de l'utilisateur (doit être unique)
  email: { type: String, required: true, unique: true },
  // Mot de passe de l'utilisateur
  password: { type: String, required: true },
  // Date de création du compte utilisateur
  createdAt: { type: Date },
  // Dernière activité de l'utilisateur
  lastActivity: { type: Date }
});

// Applique le plugin uniqueValidator au schéma d'utilisateur pour garantir l'unicité de l'email
userSchema.plugin(uniqueValidator);

// Création du modèle User à partir du schéma userSchema
const User = mongoose.model('User', userSchema);

// Exportation du modèle User
module.exports = User;
