let fireBaseConfig = {};

const setConfig = (fbConfig) => {
  fireBaseConfig = fbConfig;
};

const saveMovieToWishlist = (newMovie) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `${fireBaseConfig.databaseURL}/movies.json`,
      data: JSON.stringify(newMovie),
    })
      .done((uniqueKey) => {
        resolve(uniqueKey);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getAllMovies = () => {
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${fireBaseConfig.databaseURL}/movies.json`,
    })
      .done((allMoviesObject) => {
        if (allMoviesObject !== null) {
          Object.keys(allMoviesObject).forEach((fbKey) => {
            allMoviesObject[fbKey].id = fbKey;
            allMoviesArray.push(allMoviesObject[fbKey]);
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const deleteMovieFromDb = (movieId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `${fireBaseConfig.databaseURL}/movies/${movieId}.json`,
    })
      .done(() => {
        resolve();
      })
      .fail((error) => {
        reject(error);
      });
  });
};

module.exports = {
  saveMovieToWishlist,
  setConfig,
  getAllMovies,
  deleteMovieFromDb,
};
