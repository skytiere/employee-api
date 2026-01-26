import { useState, useEffect } from "react";
import "./App.css";

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

function App() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calls your .NET backend API
      const response = await fetch("/weatherforecast");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setForecasts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching weather data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Employee API - Weather Dashboard</h1>
      <p>React frontend connected to .NET backend</p>

      <button onClick={fetchWeatherData} disabled={loading}>
        {loading ? "Loading..." : "Refresh Data"}
      </button>

      {error && (
        <div style={{ color: "red", margin: "1rem 0" }}>Error: {error}</div>
      )}

      {loading && <p>Loading weather data...</p>}

      {!loading && !error && forecasts.length > 0 && (
        <table style={{ margin: "2rem auto", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Temp (°C)
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Temp (°F)
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Summary
              </th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((forecast, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(forecast.date).toLocaleDateString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {forecast.temperatureC}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {forecast.temperatureF}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {forecast.summary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
