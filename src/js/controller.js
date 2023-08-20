import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

/* if (module.hot){
  module.hot.accept();
} */

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function(){
  try{

    //getting hash
    const id = window.location.hash.slice(1);
    
    if(!id) return;

    //loader
    recipeView.renderSpinner();

    //0
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //get data from api   
    await model.loadRecipe(id);

    //display recipe
    recipeView.render(model.state.recipe);


  } catch (err) {
    recipeView.renderError();
  }
  
}

const controlSearchResults = async function(){
  try {
    
    //get search query
    const query = searchView.getQuery();
    if(!query) return;
    
    //loader
    resultsView.renderSpinner();

    //load query result
    await model.loadSearchResults(query);

    //render results
    resultsView.render(model.getSearchResultsPage());

    //render pagination
    paginationView.render(model.state.search);

    
  } catch (err) {
    console.log(err)
  }
}


const controlPagination = function(goToPage){
    //render results
    resultsView.render(model.getSearchResultsPage(goToPage));

    //render pagination
    paginationView.render(model.state.search);
}

const controllerServings = function(newServing){

  model.updateServings(newServing);

  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function(){

  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);

}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddNewRecipe = async function(newRecipe){
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //bookmark
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close modal
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC  * 1000);

    
  } catch (error) {
      console.log(error);
      addRecipeView.renderError(error.message);
    }
}

/* controlRecipes(); */
const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controllerServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerNewRecipe(controlAddNewRecipe);
  console.log('project-started');
}
init();

const clearBookmarks = function(){
  localStorage.clear('bookmarks');
}
/* clearBookmarks(); */