﻿namespace Server.Models;

public class Favourite
{
    public int Id { get; set; }
    public int RecipeId { get; set; }
    public string UserId { get; set; }
    public virtual Recipe Recipe { get; set; }
    public virtual User User { get; set; }
}