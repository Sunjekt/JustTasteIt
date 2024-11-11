using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [EnableCors]
    [ApiController]
    public class CategoriesController : ControllerBase //Контроллер для категорий
    {
        private readonly ModelsManager _context;
        public CategoriesController(ModelsManager context)
        {
            _context = context;
        }


        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategory() // метод получения всех категорий
        {
            return await _context.Category.Include(p => p.Recipe).ToListAsync();
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id) // метод получения одной категории по id
        {
            var category = await _context.Category.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }
    }
}
