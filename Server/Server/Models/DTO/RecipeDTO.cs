namespace Server.Models.DTO
{
    public class RecipeDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Portion { get; set; }
        public string Time { get; set; }
        public string UserId { get; set; }
        public int CategoryId { get; set; }
    }
}
