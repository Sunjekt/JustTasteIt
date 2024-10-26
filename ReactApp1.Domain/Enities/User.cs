using Microsoft.AspNetCore.Identity;

namespace ReactApp1.Domain.Enities
{
    public class User : IdentityUser
    {
        public User()
        {
            Recipe = new HashSet<Recipe>();
            Favourite = new HashSet<Favourite>();
        }
        public virtual ICollection<Recipe> Recipe { get; set; }
        public virtual ICollection<Favourite> Favourite { get; set; }
    }
}

