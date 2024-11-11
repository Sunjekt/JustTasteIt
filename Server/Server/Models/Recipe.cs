namespace Server.Models;

public class Recipe
{
    public Recipe()
    {
        Ingredient = new HashSet<Ingredient>();
        RecipeStep = new HashSet<RecipeStep>();
        Favourite = new HashSet<Favourite>();
    }
    public int Id { get; set; }
    public  string Name { get; set; }
    public string Description { get; set; }
    public int Portion { get; set; }
    public string Time { get; set; }
    public string UserId { get; set; }
    public int CategoryId { get; set; }
    public virtual Category Category { get; set; }
    public virtual User User { get; set; }
    public virtual ICollection<Favourite> Favourite { get; set; }
    public virtual ICollection<Ingredient> Ingredient { get; set; }
    public virtual ICollection<RecipeStep> RecipeStep { get; set; }

}