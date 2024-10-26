using ReactApp1.Domain.Enities;
using ReactApp1.Server.Context;

namespace ReactApp1.Server.Data
{
    public static class ModelsManagerSeed
    {
        public static async Task SeedAsync(ModelsManager context)
        {
            try
            {
                context.Database.EnsureCreated();

                if (context.Category.Any())
                {
                    return;
                }
                var categories = new Category[]
                {
                    new Category{Name = "Завтрак"},
                    new Category{Name = "Обед"},
                    new Category{Name = "Ужин"},
                    new Category{Name = "Салаты"},
                    new Category{Name = "Закуски"},
                    new Category{Name = "Десерты"},
                };
                foreach (Category b in categories)
                {
                    context.Category.Add(b);
                }
                await context.SaveChangesAsync();

                var measurements = new Measurement[]
                {
                    new Measurement{Name = "стакан"},
                    new Measurement{Name = "ст. л."},
                    new Measurement{Name = "ч. л."},
                    new Measurement{Name = "шт."},
                    new Measurement{Name = "зубчик"},
                    new Measurement{Name = "г"},
                    new Measurement{Name = "мл"},
                    new Measurement{Name = "л"},
                    new Measurement{Name = "кг"},
                    new Measurement{Name = "лист"},
                    new Measurement{Name = "пучок"},
                    new Measurement{Name = "перо"},
                    new Measurement{Name = "головка"},
                    new Measurement{Name = "щепотка"},
                    new Measurement{Name = "веточка"},
                    new Measurement{Name = "кочан"},
                    new Measurement{Name = "ломтик"},
                    new Measurement{Name = "палочка"},
                    new Measurement{Name = "долька"},
                    new Measurement{Name = "по вкусу"},
                    new Measurement{Name = "по желанию"},
                    new Measurement{Name = "банка / 100 г"},
                    new Measurement{Name = "банка / 150 г"},
                    new Measurement{Name = "банка / 200 г"},
                    new Measurement{Name = "банка / 250 г"},
                    new Measurement{Name = "банка / 300 г"},
                    new Measurement{Name = "банка / 350 г"},
                    new Measurement{Name = "банка / 370 г"},
                    new Measurement{Name = "банка / 380 г"},
                    new Measurement{Name = "банка / 400 г"},
                    new Measurement{Name = "метр"},
                    new Measurement{Name = "капля"},
                };
                foreach (Measurement b in measurements)
                {
                    context.Measurement.Add(b);
                }
                await context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }
    }
}
