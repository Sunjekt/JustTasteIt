namespace Server.Models;

public class Ingredient
{
    public int Id { get; set; }
    public int Count { get; set; }
    public string Name { get; set; }
    public int MeasurementId { get; set; }
    public int RecipeId { get; set; }
    public virtual Measurement Measurement { get; set; }
    public virtual Recipe Recipe { get; set; }

}