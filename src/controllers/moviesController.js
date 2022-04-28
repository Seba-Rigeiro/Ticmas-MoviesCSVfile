const fs = require('fs');
const db  = require('../../database/models/index');
const { Op } = require('sequelize')
const csv = require("csvtojson");


  const addMoviesFromCSV = (req, res) => {
    if (!req.files || !req.files.upload_file) {
      res.status(404)
        .send('File not found');
    } else if (req.files.upload_file.mimetype === 'text/csv') {

      const fileReceived = req.files.upload_file;
      const fileReceivedPath = 'movies-' + Date.now() +'.csv';

      fs.writeFile(fileReceivedPath, fileReceived.data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

      csv({
        noheader: false,
        headers: ['titulo','genero','year','director','actores'],
        delimiter: [";"]
      })
      .fromFile(fileReceivedPath)
      .then(
        function(movies){
          console.log(movies);

          movies.forEach(movie => {
            db.Movie.findOrCreate({
              where: { titulo: movie.titulo },
              defaults: { 
                titulo : movie.titulo,
                genero: movie.genero,
                year: movie.year,
                director: movie.director,
                actores: movie.actores
              }
            });
          });          
          res.send('The file has been successfully saved');
        },
       /*  function(reason){
          console.error(reason);
        } */)

    }
  }

  const searchMovies = async (req, res) => {

    let pageSize = req.query.page ;
    let pageLimit = 20;

    let whereCondition;

    if(Object.entries(req.query).length === 0){
      whereCondition = {}
    }else{
      whereCondition = {
        titulo: { [Op.like]: "%" + req.query.titulo + "%"} || ''
      };
    }

    const limit = parseInt(pageLimit, 10) || 10;
    const page = parseInt(pageSize, 10) || 1;

    const { count, rows} = await db.Movie.findAndCountAll({
        where: whereCondition,
        attributes: ['titulo', 'genero', 'year', 'director', 'actores'],
        order: [['titulo', 'ASC']],
        limit: limit,
        offset: limit * (page - 1)
    });
    
    const getNextPage = (page, limit, total) => {
        if ((total/limit) > page) {
            return page + 1;
        }
        return null
    }
    
    const getPreviousPage = (page) => {
        if (page <= 1) {
            return null
        }
        return page - 1;
    }
    
    res.status(200).json({
        previousPage: getPreviousPage(page),
        currentPage: page,
        nextPage: getNextPage(page, limit, count),
        limit: limit,
        total: count,
        data:rows  })
}

const updateMovie = async (req, res) => {
    
  const { id } = req.params
  const { titulo, genero, year, director, actores } = req.body
  
  const movie = await db.Movie.findByPk(id);
   
  if (!movie) {
      res.status(404).json('Movie not found');
    
  } else {
      await db.Movie.update({
        titulo: titulo,
        genero: genero,
        year: year,
        director: director,
        actores: actores, 
      },
          { where: { id }}
      );
      const updatedMovie = await db.Movie.findByPk(id)
      
      res.status(201).json({
          msg: 'Movie Successfully Updated',
          updatedMovie:updatedMovie
      });
  }
};

const deleteMovie = async (req, res) => {

  try {
      const { id } = req.params;

      const movie = await db.Movie.findByPk(id);
      //Message if the movie not found
      if (!movie) {
          res.status(404).json('movie not found');
      //Found the movie and deleted
      } else {

          await db.Movie.destroy( {
              where: { id }
          })
          res.status(201).json({ msg: 'The movie was correctly deleted' })
      }

  } 
  catch (err) {res.status(500).json({ 
      msg: 'ERROR - the movie couldn`t be deleted' })
  }
};



  module.exports = { searchMovies, addMoviesFromCSV, updateMovie, deleteMovie }


  