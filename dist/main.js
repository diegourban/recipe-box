var DeleteRecipeButton = React.createClass({
  displayName: "DeleteRecipeButton",

  handleClick: function () {
    this.props.onDeleteClick(this.props.recipeId);
  },
  render: function () {
    return React.createElement(
      "button",
      { type: "button", id: "deleteRecipeButton", className: "btn btn-danger", onClick: this.handleClick },
      "Delete"
    );
  }
});

var EditRecipeButton = React.createClass({
  displayName: "EditRecipeButton",

  handleClick: function () {
    this.props.onEditClick(this.props.recipeId);
  },
  render: function () {
    return React.createElement(
      "button",
      { type: "button", id: "editRecipeButton", className: "btn btn-default", "data-toggle": "modal", "data-target": "#recipeModal", onClick: this.handleClick },
      "Edit"
    );
  }
});

var ListItemWrapper = React.createClass({
  displayName: "ListItemWrapper",

  render: function () {
    return React.createElement(
      "li",
      { className: "list-group-item" },
      this.props.data
    );
  }
});

var IngredientsList = React.createClass({
  displayName: "IngredientsList",

  render: function () {
    var ingredientsList = [];
    this.props.ingredients.forEach(function (ingredient) {
      ingredientsList.push(React.createElement(ListItemWrapper, { key: Math.random() * 100 + 1, data: ingredient }));
    });

    return React.createElement(
      "ul",
      { className: "list-group" },
      ingredientsList
    );
  }
});

var RecipePanel = React.createClass({
  displayName: "RecipePanel",

  handleDeleteButtonClick: function (id) {
    this.props.onDeleteRecipe(id);
  },
  handleEditButtonClick: function (id) {
    this.props.onEditRecipe(id);
  },
  render: function () {
    var collapsibleDivClasses = "panel-collapse collapse";
    if (this.props.open === true) {
      collapsibleDivClasses += " in";
    }

    return React.createElement(
      "div",
      { className: "panel panel-default" },
      React.createElement(
        "div",
        { className: "panel-heading", id: "heading" + this.props.index },
        React.createElement(
          "a",
          { role: "button", "data-toggle": "collapse", "data-parent": "#accordion", href: "#collapse" + this.props.index, "aria-expanded": "true", "aria-controls": "collapse" + this.props.index },
          this.props.recipe.name
        )
      ),
      React.createElement(
        "div",
        { id: "collapse" + this.props.index, className: collapsibleDivClasses, role: "tabpanel", "aria-labelledby": "heading" + this.props.index },
        React.createElement(
          "div",
          { className: "panel-body" },
          React.createElement(IngredientsList, { ingredients: this.props.recipe.ingredients })
        ),
        React.createElement(
          "div",
          { className: "panel-footer" },
          React.createElement(
            "div",
            { className: "btn-group" },
            React.createElement(DeleteRecipeButton, { onDeleteClick: this.handleDeleteButtonClick, recipeId: this.props.recipe.id }),
            React.createElement(EditRecipeButton, { onEditClick: this.handleEditButtonClick, recipeId: this.props.recipe.id })
          )
        )
      )
    );
  }
});

var AddRecipeButton = React.createClass({
  displayName: "AddRecipeButton",

  handleClick: function () {
    this.props.onAddRecipe();
  },
  render: function () {
    return React.createElement(
      "button",
      { type: "button", id: "addRecipeButton", className: "btn btn-primary", "data-toggle": "modal", "data-target": "#recipeModal", onClick: this.handleClick },
      "Add Recipe"
    );
  }
});

var RecipeModal = React.createClass({
  displayName: "RecipeModal",

  getInitialState: function () {
    return { id: 0, name: '', ingredients: '', isEditing: false };
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.data.isEditing) {
      var ingredientsJoined = nextProps.data.ingredients.join(", ");
      this.setState({ id: nextProps.data.id, name: nextProps.data.name, ingredients: ingredientsJoined, isEditing: true });
    } else {
      this.setState({ id: 0, name: '', ingredients: '', isEditing: false });
    }
  },
  handleNameChange: function (e) {
    this.setState({ name: e.target.value });
  },
  handleIngredientsChange: function (e) {
    this.setState({ ingredients: e.target.value });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var ingredients = [];
    this.state.ingredients.split(',').forEach(function (ingredient) {
      ingredients.push(ingredient.trim());
    });
    if (!name || !ingredients) {
      return;
    }
    this.props.onRecipeSubmit({ id: this.state.id, name: name, ingredients: ingredients });
    this.setState({ id: 0, name: '', ingredients: '' });
    $('#recipeModal').modal('hide');
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "modal fade", id: "recipeModal", tabindex: "-1", role: "dialog" },
      React.createElement(
        "div",
        { className: "modal-dialog" },
        React.createElement(
          "div",
          { className: "modal-content" },
          React.createElement(
            "div",
            { className: "modal-header" },
            React.createElement(
              "button",
              { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
              React.createElement(
                "span",
                { "aria-hidden": "true" },
                "\xD7"
              )
            ),
            React.createElement(
              "h4",
              { className: "modal-title" },
              this.state.isEditing ? 'Edit a Recipe' : 'Add a Recipe'
            )
          ),
          React.createElement(
            "form",
            { onSubmit: this.handleSubmit },
            React.createElement(
              "div",
              { className: "modal-body" },
              React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                  "label",
                  { "for": "recipeName" },
                  "Recipe"
                ),
                React.createElement("input", { type: "text", className: "form-control", id: "recipeName",
                  placeholder: "Recipe Name", onChange: this.handleNameChange, value: this.state.name })
              ),
              React.createElement(
                "div",
                { className: "form-group" },
                React.createElement(
                  "label",
                  { "for": "ingredients" },
                  "Ingredients"
                ),
                React.createElement("textarea", { className: "form-control", id: "ingredients", rows: "2\t", cols: "50",
                  placeholder: "Enter Ingredients, Separated, By Commas...", onChange: this.handleIngredientsChange, value: this.state.ingredients })
              )
            ),
            React.createElement(
              "div",
              { className: "modal-footer" },
              React.createElement(
                "button",
                { type: "submit", className: "btn btn-primary" },
                this.state.isEditing ? 'Edit Recipe' : 'Add Recipe'
              ),
              React.createElement(
                "button",
                { type: "button", className: "btn btn-default", "data-dismiss": "modal" },
                "Close"
              )
            )
          )
        )
      )
    );
  }
});

var RecipeBox = React.createClass({
  displayName: "RecipeBox",

  getInitialState: function () {
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
  loadCommentsFromLocalStorage: function () {
    var storageData = localStorage[this.props.localStorageName];
    if (typeof storageData != 'undefined') {
      storageData = JSON.parse(storageData);
    } else {
      storageData = JSON.parse(DEFAULT_DATA);
    }
    this.setState({
      data: storageData
    });
  },
  handleRecipeSubmit: function (recipe) {
    var recipes = this.state.data;
    if (!recipe.id) {
      // Optimistically set an id on the new comment. It will be replaced by an
      // id generated by the server. In a production application you would likely
      // not use Date.now() for this and would have a more robust system in place.
      recipe.id = Date.now();
      var newRecipes = recipes.concat([recipe]);
      this.setState({ data: newRecipes });
      this.updateLocalStorage(newRecipes);
    } else {
      for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].id === recipe.id) {
          recipes[i].name = recipe.name;
          recipes[i].ingredients = recipe.ingredients;
          break;
        }
      }
      this.setState({ data: recipes });
      this.updateLocalStorage(recipes);
    }
  },
  handleAddRecipe: function () {
    this.setState({ modalData: { id: 0, name: '', ingredients: '', isEditing: false } });
  },
  handleDeleteRecipe: function (recipeId) {
    var recipes = this.state.data;
    var newRecipes = recipes.filter(function (elem) {
      return elem.id !== recipeId;
    });
    this.setState({ data: newRecipes });
    this.updateLocalStorage(newRecipes);
  },
  handleEditRecipe: function (recipeId) {
    var recipe = this.state.data.filter(function (elem) {
      return elem.id === recipeId;
    });
    this.setState({ modalData: { id: recipe[0].id, name: recipe[0].name, ingredients: recipe[0].ingredients, isEditing: true } });
    this.updateLocalStorage(this.state.data);
  },
  updateLocalStorage: function (recipes) {
    localStorage.setItem(this.props.localStorageName, JSON.stringify(recipes));
  },
  componentDidMount: function () {
    this.loadCommentsFromLocalStorage();
  },
  render: function () {
    var recipes = [];
    var isOpen = true;
    if (this.state.data) {
      for (var i = 0; i < this.state.data.length; i++) {
        recipes.push(React.createElement(RecipePanel, { recipe: this.state.data[i], index: i, key: this.state.data[i].id, open: isOpen, onDeleteRecipe: this.handleDeleteRecipe, onEditRecipe: this.handleEditRecipe }));
        isOpen = false;
      }
    }
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "panel-group", id: "accordion", role: "tablist", "aria-multiselectable": "true" },
        recipes
      ),
      React.createElement(AddRecipeButton, { onAddRecipe: this.handleAddRecipe }),
      React.createElement(RecipeModal, { onRecipeSubmit: this.handleRecipeSubmit, data: this.state.modalData })
    );
  }
});

var DEFAULT_DATA = '[{"id": 1388534400000, "name": "Recipe 1", "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"]}]';

ReactDOM.render(React.createElement(RecipeBox, { localStorageName: "_diegourban_recipes" }), document.getElementById('container'));