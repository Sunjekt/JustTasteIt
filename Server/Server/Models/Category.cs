namespace Server.Models;

public class Category
{
    public Category()
    {
        Recipe = new HashSet<Recipe>();
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<Recipe> Recipe { get; set; }
}