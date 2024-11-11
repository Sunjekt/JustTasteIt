using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("api/[controller]")] 
    [ApiController]
    public class RecipesController : ControllerBase //контроллер для рецепта
    {
        private readonly ModelsManager _context;

        public RecipesController(ModelsManager context)
        {
            _context = context;
        }

        // GET: api/Recipes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipe()  // метод получения всех рецептов
        {
            if (_context.Recipe == null)
            {
                return NotFound();
            }
            return await _context.Recipe.ToListAsync();
        }

        // GET: api/Recipes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id) // метод получения одного рецепта по id
        {
            if (_context.Recipe == null)
            {
                return NotFound();
            }
            var recipe = await _context.Recipe.FindAsync(id);

            if (recipe == null)
            {
                return NotFound();
            }

            return recipe;
        }

        // PUT: api/Recipes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, RecipeDTO recipeDto) // метод изменения рецепта
        {
            var rec = new Recipe
            {
                Id = id,
                Name = recipeDto.Name,
                Description = recipeDto.Description,
                Portion = recipeDto.Portion,
                Time = recipeDto.Time,
                CategoryId = recipeDto.CategoryId,
                UserId = recipeDto.UserId,
            };

            _context.Entry(rec).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Recipes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Recipe>> PostRecipe(RecipeDTO recipeDto) // метод создания продукта
        {
            if (_context.Recipe == null)
            {
                return Problem("Entity set 'ModelsManager.Recipe'  is null.");
            }
            var prod = new Recipe
            {
                Name = recipeDto.Name,
                Description = recipeDto.Description,
                Portion = recipeDto.Portion,
                Time = recipeDto.Time,
                CategoryId = recipeDto.CategoryId,
                UserId = recipeDto.UserId,
            };
            _context.Recipe.Add(prod);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRecipe", new { id = prod.Id }, prod);
        }

        // DELETE: api/Recipes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id) // метод удаления рецепта
        {
            if (_context.Recipe == null)
            {
                return NotFound();
            }
            var recipe = await _context.Recipe.FindAsync(id);
            if (recipe == null)
            {
                return NotFound();
            }

            _context.Recipe.Remove(recipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RecipeExists(int id)
        {
            return (_context.Recipe?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
