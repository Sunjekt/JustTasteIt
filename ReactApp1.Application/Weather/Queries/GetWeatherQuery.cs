using MediatR;
using ReactApp1.Domain.Enities;

namespace ReactApp1.Application.Weather.Queries;

public record GetWeatherQuery : IRequest<List<WeatherForecast>>;