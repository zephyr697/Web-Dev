import axios from "axios";
import { baseURL } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(baseURL + `get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      // console.log(res);
    } catch (error) {
      console.log(error);
      displayError("Something went wrong :(");
    }
  }

  calcTime() {
    // Assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const period = Math.ceil(numIng / 3);
    this.time = period * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds"];
    const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound"];
    const units = [...unitsShort,'kg','g'];
    const newIngredients = this.ingredients.map((el) => {
      //  1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, units[i]);
      });

      //  2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      //  3) parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => unitsShort.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // Unit found
        const arrCount = arrIng.slice(0, unitIndex); // E.g: 4 1/2 cups
        let count;
        if (arrCount.length === 1) {
          //E.g: 4 cups flour
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          //E.g: 4 1/2 cups flour
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit but 1st element is a number. E.g: 3 bread sticks
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // There is no unit and NO number in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings (type) {
    // update servings
    const newServings = type ==='dec'?this.servings-1:this.servings+1

    // update ingredients
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings);
    });
    
    this.servings = newServings;
  }
}