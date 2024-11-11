namespace Server.Models;

public class Measurement
{
    public Measurement()
    {
        Ingredient = new HashSet<Ingredient>();
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<Ingredient> Ingredient { get; set; }
}