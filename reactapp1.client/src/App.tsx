import {useCallback, useEffect, useState} from 'react';
import './App.css';
import {WeatherForecast, WeatherForecastClient} from "./shared/g.ts";

const weatherService = new WeatherForecastClient();

function App() {
    const [forecasts, setForecasts] = useState<WeatherForecast[]>();

    const getWeather = useCallback(async () => {
        try {
            const weather = await weatherService.get();
            console.log('received weather', weather);
            setForecasts(weather);
        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        getWeather();
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a
            href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em>
        </p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
            <tr>
                <th>Date</th>
                <th>Temp. (C)</th>
                <th>Temp. (F)</th>
                <th>Summary</th>
            </tr>
            </thead>
            <tbody>
            {forecasts.map(forecast =>
                <tr key={forecast.summary}>
                    <td>{forecast.date?.getDate()}</td>
                    <td>{forecast.temperatureC}</td>
                    <td>{forecast.temperatureF}</td>
                    <td>{forecast.summary}</td>
                </tr>
            )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
}

export default App;