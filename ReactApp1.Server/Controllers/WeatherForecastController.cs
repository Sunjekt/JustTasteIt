using MediatR;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Application.Weather.Queries;
using ReactApp1.Domain.Enities;

namespace ReactApp1.Server.Controllers;

/// <summary>
/// Контроллер погоды
/// </summary>
/// <param name="mediator">Шина MediatR</param>
[ApiController]
[Route("api/[controller]")]
public class WeatherForecastController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Получение прогноза погоды
    /// </summary>
    /// <returns>Прогноз погоды на 5 дней</returns>
    [HttpGet("[action]")]
    public Task<List<WeatherForecast>> Get()
    {
        return mediator.Send(new GetWeatherQuery());
    }
}