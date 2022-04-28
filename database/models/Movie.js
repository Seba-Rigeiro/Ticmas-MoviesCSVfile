'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Movie.init({
    titulo: DataTypes.STRING,
    genero: DataTypes.STRING,
    year: DataTypes.STRING,
    director: DataTypes.STRING,
    actores: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};