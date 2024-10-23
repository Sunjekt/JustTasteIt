using Microsoft.Extensions.DependencyInjection;

namespace ReactApp1.Application;

public static class DependencyInjection
{
    /// <summary>
    /// Добавить сервисы слоя Application
    /// </summary>
    /// <param name="services">Коллекция сервисов</param>
    /// <returns>Коллекция сервисов</returns>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => { cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly); });

        return services;
    }
}