import { useState, useEffect } from "react";
import "./App.css";
import Button from "./components/Button";

interface Recipe {
  strMeal: string;
  strCategory: string;
  strMealThumb: string;
  strInstructions: string;
  [key: `strIngredient${number}`]: string | undefined; //an array of all ingredients
  [key: `strMeasure${number}`]: string | undefined; //an array of all ingredient measurements
}

interface ApiResponse {
  meals: Recipe[];
}

//loops 20 times through the response and gets measurements and ingredients
function extractIngredientsAndMeasures(
  recipe: Recipe
): { ingredient: string; measure: string }[] {
  const ingredientsAndMeasures: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}` as keyof Recipe;
    const measureKey = `strMeasure${i}` as keyof Recipe;
    const ingredient = recipe[ingredientKey];
    const measure = recipe[measureKey];
    if (ingredient && ingredient.trim() && measure && measure.trim()) {
      ingredientsAndMeasures.push({ ingredient, measure });
    }
  }
  return ingredientsAndMeasures;
}

function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ingredientsAndMeasures, setIngredientsAndMeasures] = useState<
    { ingredient: string; measure: string }[]
  >([]);

  const fetchRecipe = async () => {
    setIsLoading(true);
    setError(null);
    const url = "https://www.themealdb.com/api/json/v1/1/random.php";
    try {
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      if (data.meals && data.meals.length > 0) {
        setRecipe(data.meals[0]);
        const combinedIngredientsAndMeasures = extractIngredientsAndMeasures(
          data.meals[0]
        );
        setIngredientsAndMeasures(combinedIngredientsAndMeasures); // Store in state
      } else {
        console.error("No meals found in the response");
        setError("No meals found");
      }
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      setError("Failed to fetch recipe");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, []);

  return (
    <>
      <Button onClick={fetchRecipe}>Random Recipe</Button>
      <div className="mx-auto px-2 py-12 bg-slate-100 flex justify-center items-center flex-row min-h-screen flex-wrap md:w-1/2">
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {recipe && (
          <div className="py-4 flex gap-4 flex-wrap justify-around items-start">
            <div>
              <h1 className="text-2xl font-semibold">
                {recipe.strMeal} <span>({recipe.strCategory})</span>
              </h1>
              <img
                className="rounded-2xl"
                width={300}
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
              />
            </div>
            <div>
              <h2 className="font-semibold text-xl mb-2">Ingredients:</h2>
              <ul>
                {ingredientsAndMeasures.map((item, index) => (
                  <li key={index}>
                    {item.measure} {item.ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="py-4 w-3/4">{recipe?.strInstructions} </div>
      </div>
    </>
  );
}

export default App;
