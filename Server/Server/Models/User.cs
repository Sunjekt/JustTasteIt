using Microsoft.AspNetCore.Identity;

namespace Server.Models
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

