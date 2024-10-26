using MediatR;
using ReactApp1.Domain.Enities;

namespace ReactApp1.Application.Weather.Queries;

public class GetRecipeQueryHandler : IRequestHandler<GetRecipeQuery, List<Recipe>>
{
    private static readonly string[] Names = new[]
    {
        "Яблочный пирог", "Жареная картошка", "Борщ", "Овощной салат"
    };

    private static readonly string[] Categories = new[]
    {
        "Завтрак", "Обед", "Ужин", "Салаты", "Закуски", "Десерты"
    };

    public Task<List<Recipe>> Handle(GetRecipeQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Enumerable.Range(1, 5).Select(index => new Recipe
        {
            Name = Names[Random.Shared.Next(Names.Length)],
            Description = "Очень вкусно и полезно!",
            //UserId = 1,
            Portion = Random.Shared.Next(1, 10)
        })
            .ToList());
    }
}