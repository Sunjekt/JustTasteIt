using System.Reflection;
using NSwag;

namespace ReactApp1.Server;

public static class DependencyInjection
{
    /// <summary>
    /// Добавление сервисов API в контейнер
    /// </summary>
    /// <param name="services">Контейнер сервисов</param>
    /// <returns>Контейнер сервисов</returns>
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        // Добавляем Swagger
        services.AddSwaggerGen(options =>
        {
            var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
        });

        // Добавляем документацию в формате OpenAPI
        services.AddOpenApiDocument(config =>
        {
            config.Title = "Lab 2";
            config.Version = "v1";

            config.AddSecurity("JWT", [], new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.ApiKey,
                Name = "Authorization",
                In = OpenApiSecurityApiKeyLocation.Header,
                Description = "Введите в поле: Bearer {ваш JWT токен}."
            });
        });

        return services;
    }
}