var DeleteRecipeButton = React.createClass({
  handleClick: function() {
    this.props.onDeleteClick(this.props.recipeId);
  },
  render: function() {
    return (
      <button type="button" id="deleteRecipeButton" className="btn btn-danger" onClick={this.handleClick}>Delete</button>
    )
  }
});

var EditRecipeButton = React.createClass({
  handleClick: function() {
    this.props.onEditClick(this.props.recipeId);
  },
  render: function() {
    return (
      <button type="button" id="editRecipeButton" className="btn btn-default" data-toggle="modal" data-target="#recipeModal" onClick={this.handleClick}>Edit</button>
    )
  }
});

var ListItemWrapper = React.createClass({
  render: function() {
  return <li className="list-group-item">{this.props.data}</li>;
  }
});

var IngredientsList = React.createClass({
  render: function() {
    var ingredientsList = [];
    this.props.ingredients.forEach(function(ingredient) {
      ingredientsList.push(<ListItemWrapper key={(Math.random() * 100) + 1} data={ingredient}/>);
    })

    return <ul className="list-group">{ingredientsList}</ul>;
  }
});

var RecipePanel = React.createClass({
  handleDeleteButtonClick: function(id) {
    this.props.onDeleteRecipe(id);
  },
  handleEditButtonClick: function(id) {
    this.props.onEditRecipe(id);
  },
  render: function() {
    var collapsibleDivClasses = "panel-collapse collapse";
    if(this.props.open === true) {
      collapsibleDivClasses += " in";
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading" id={"heading" + this.props.index}>
          <a role="button" data-toggle="collapse" data-parent="#accordion" href={"#collapse" + this.props.index} aria-expanded="true" aria-controls={"collapse" + this.props.index}>
            {this.props.recipe.name}
          </a>
        </div>

        <div id={"collapse" + this.props.index} className={collapsibleDivClasses} role="tabpanel" aria-labelledby={"heading" + this.props.index}>
          <div className="panel-body">
            <IngredientsList ingredients={this.props.recipe.ingredients}/>
          </div>

          <div className="panel-footer">
            <div className="btn-group">
              <DeleteRecipeButton onDeleteClick={this.handleDeleteButtonClick} recipeId={this.props.recipe.id}/>
              <EditRecipeButton onEditClick={this.handleEditButtonClick} recipeId={this.props.recipe.id}/>
            </div>

          </div>
        </div>

      </div>
    )
  }
});

var AddRecipeButton = React.createClass({
  handleClick: function() {
    this.props.onAddRecipe();
  },
  render: function() {
    return (
      <button type="button" id="addRecipeButton" className="btn btn-primary" data-toggle="modal" data-target="#recipeModal" onClick={this.handleClick}>Add Recipe</button>
    )
  }
});

var RecipeModal = React.createClass({
  getInitialState: function() {
    return {id: 0, name: '', ingredients: '', isEditing: false};
  },
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.data.isEditing) {
      var ingredientsJoined = nextProps.data.ingredients.join(", ");
      this.setState({id: nextProps.data.id, name: nextProps.data.name, ingredients: ingredientsJoined, isEditing: true});
    } else {
      this.setState({id: 0, name: '', ingredients: '', isEditing: false});
    }
  },
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleIngredientsChange: function(e) {
    this.setState({ingredients: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var ingredients = [];
    this.state.ingredients.split(',').forEach(function(ingredient) {
      ingredients.push(ingredient.trim());
    });
    if (!name || !ingredients) {
      return;
    }
    this.props.onRecipeSubmit({id: this.state.id, name: name, ingredients: ingredients});
    this.setState({id: 0, name: '', ingredients: ''});
    $('#recipeModal').modal('hide');
  },
  render: function() {
    return (
      <div className="modal fade" id="recipeModal" tabindex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">{this.state.isEditing ? 'Edit a Recipe' : 'Add a Recipe'}</h4>
            </div>

            <form onSubmit={this.handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label for="recipeName">Recipe</label>
                  <input type="text" className="form-control" id="recipeName"
                    placeholder="Recipe Name" onChange={this.handleNameChange} value={this.state.name}/>
                </div>

                <div className="form-group">
                  <label for="ingredients">Ingredients</label>
                  <textarea className="form-control" id="ingredients" rows="2	" cols="50"
                    placeholder="Enter Ingredients, Separated, By Commas..." onChange={this.handleIngredientsChange} value={this.state.ingredients} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">{this.state.isEditing ? 'Edit Recipe' : 'Add Recipe'}</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
});

var RecipeBox = React.createClass({
  getInitialState: function() {
    return {
      data: null,
      modalData: {
        id: 0,
        name: '',
        ingredients: '',
        isEditing: false
      }
    };
  },
  loadCommentsFromLocalStorage: function() {
    var storageData = localStorage[this.props.localStorageName];
    if(typeof storageData != 'undefined') {
      storageData = JSON.parse(storageData);
    } else {
      storageData = JSON.parse(DEFAULT_DATA);
    }
    this.setState({
      data: storageData
    });
  },
  handleRecipeSubmit: function(recipe) {
    var recipes = this.state.data;
    if(!recipe.id) {
      // Optimistically set an id on the new comment. It will be replaced by an
      // id generated by the server. In a production application you would likely
      // not use Date.now() for this and would have a more robust system in place.
      recipe.id = Date.now();
      var newRecipes = recipes.concat([recipe]);
      this.setState({data: newRecipes});
      this.updateLocalStorage(newRecipes);
    } else {
      for(let i = 0; i < recipes.length; i++) {
        if(recipes[i].id === recipe.id) {
          recipes[i].name = recipe.name;
          recipes[i].ingredients = recipe.ingredients;
          break;
        }
      }
      this.setState({data: recipes});
      this.updateLocalStorage(recipes);
    }
  },
  handleAddRecipe: function() {
    this.setState({modalData: {id: 0, name: '', ingredients: '', isEditing: false}});
  },
  handleDeleteRecipe: function(recipeId) {
    var recipes = this.state.data;
    var newRecipes = recipes.filter(function(elem) {
      return elem.id !== recipeId;
    });
    this.setState({data: newRecipes});
    this.updateLocalStorage(newRecipes);
  },
  handleEditRecipe: function(recipeId) {
    var recipe = this.state.data.filter(function(elem) {
      return elem.id === recipeId;
    });
    this.setState({modalData: {id: recipe[0].id, name:recipe[0].name, ingredients: recipe[0].ingredients, isEditing: true}});
    this.updateLocalStorage(this.state.data);
  },
  updateLocalStorage: function(recipes) {
    localStorage.setItem(this.props.localStorageName, JSON.stringify(recipes));
  },
  componentDidMount: function() {
    this.loadCommentsFromLocalStorage();
  },
  render : function() {
    var recipes = [];
    var isOpen = true;
    if(this.state.data) {
      for(var i = 0; i < this.state.data.length; i++) {
        recipes.push(<RecipePanel recipe={this.state.data[i]} index={i} key={this.state.data[i].id} open={isOpen} onDeleteRecipe={this.handleDeleteRecipe} onEditRecipe={this.handleEditRecipe}/>);
        isOpen = false;
      }
    }
    return (
      <div>
        <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
          {recipes}
        </div>

        <AddRecipeButton onAddRecipe={this.handleAddRecipe}/>
        <RecipeModal onRecipeSubmit={this.handleRecipeSubmit} data={this.state.modalData}/>
      </div>
    )
  }
});

var DEFAULT_DATA = '[{"id": 1388534400000, "name": "Recipe 1", "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"]}]';

ReactDOM.render(<RecipeBox localStorageName="_diegourban_recipes" />, document.getElementById('container'));
