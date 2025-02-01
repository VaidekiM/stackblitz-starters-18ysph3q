'use client';

import { useState, useEffect } from 'react';
import { getWeather, getFiveDayForecast } from './utils/weather';
import WeatherCard from './components/WeatherCard';
import CitySearch from './components/CitySearch';
import 'font-awesome/css/font-awesome.min.css';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: { main: string; icon: string }[];
  wind: { speed: number };
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: { temp: number };
    weather: Array<{ description: string }>;
  }>;
}

const defaultCities = ['Dubai', 'New York', 'London', 'Tokyo', 'Sydney'];

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [favoriteCities, setFavoriteCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  // Load favorite cities from local storage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteCities');
    if (storedFavorites) {
      setFavoriteCities(JSON.parse(storedFavorites));
    }
  }, []);

  // Fetch weather data for default cities
  useEffect(() => {
    const fetchDefaultCitiesWeather = async () => {
      const weatherList = await Promise.all(
        defaultCities.map(async (city) => {
          const data = await getWeather(city);
          return data ? data : null;
        })
      );

      setWeatherData(weatherList.filter((data) => data !== null));
    };

    fetchDefaultCitiesWeather();
  }, []);

  // Fetch the weather details for a new searched city
  const fetchWeather = async (city: string) => {
    const data = await getWeather(city);
    if (data) {
      setWeatherData((prev) => [...prev, data]);
    }
  };

  // Fetch 5-day forecast for the selected city
  const fetchFiveDayForecast = async (city: string) => {
    try {
      const data = await getFiveDayForecast(city);
      if (data && data.list) {
        const groupedData = groupByDate(data.list);
        const forecastForEachDay = getForecastForEachDay(groupedData);
        setForecastData({ list: forecastForEachDay });
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const removeCity = (city: string) => {
    setWeatherData((prev) => prev.filter((weather) => weather.name !== city));
  };

  // Add or remove a city from favorites
  const toggleFavorite = (city: string) => {
    setFavoriteCities((prevFavorites) => {
      if (prevFavorites.includes(city)) {
        const updatedFavorites = prevFavorites.filter((fav) => fav !== city);
        localStorage.setItem(
          'favoriteCities',
          JSON.stringify(updatedFavorites)
        );
        return updatedFavorites;
      } else {
        const updatedFavorites = [...prevFavorites, city];
        localStorage.setItem(
          'favoriteCities',
          JSON.stringify(updatedFavorites)
        );
        return updatedFavorites;
      }
    });
  };

  const groupByDate = (data: any[]) => {
    return data.reduce((acc, day) => {
      const date = new Date(day.dt * 1000).toLocaleDateString(); // Get date without time
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(day);
      return acc;
    }, {} as { [key: string]: any[] });
  };

  const getForecastForEachDay = (groupedData: { [key: string]: any[] }) => {
    return Object.values(groupedData).map((dayGroup) => dayGroup[0]);
  };

  // Handle clicking on a city tile
  const handleCityClick = async (city: WeatherData) => {
    setSelectedCity(city);
    await fetchFiveDayForecast(city.name);
  };

  // Handle going back to the city tiles view
  const handleBackToCities = () => {
    setSelectedCity(null);
    setForecastData(null);
  };

  return (
    <main className="flex min-h-screen text-white bg-white ">
      {/* Left Pane: City Search and Favorite Cities */}

      <div className="md:w-1/4 shadow-xl">
        <div className="border-b-2 mb-4 h-20 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg flex justify-center items-center">
          <a href="/" className="text-xl font-italic">
            Weather Dashboard
          </a>
        </div>

        <CitySearch onSearch={fetchWeather} />

        {/* Navigation Menu */}
        <div className="mt-4 p-4">
          <h3 className="font-semibold text-black">Navigation</h3>
          <div className="border-b-2 border-gray-300 mb-4"></div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="flex items-center text-black hover:text-indigo-800"
            >
              <i className="fa fa-home mr-2"></i> Home
            </a>
          </div>
        </div>

        {/* Favorite Cities */}
        {favoriteCities.length > 0 && (
          <div className="m-4">
            <h2 className="font-semibold text-black">Favorite Cities</h2>
            <div className="border-b-2 border-gray-300 mb-4"></div>
            <div className="md:w-1/2 grid grid-cols-1 gap-1 mt-2 text-black">
              {weatherData
                .filter((weather) => favoriteCities.includes(weather.name))
                .map((weather) => (
                  <div
                    key={weather.name}
                    className="flex justify-between items-center p-2 rounded-xl border shadow-sm cursor-pointer bg-gray-100"
                    onClick={() => handleCityClick(weather)}
                  >
                    <div className="flex items-center">
                      <h4 className="text-sm font-semibold mr-2">
                        {weather.name}
                      </h4>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Pane: Displaying Weather Details or City Tiles */}
      <div className="md:w-3/4">
        <div className="border-b-2 h-20 bg-gray-100 text-white shadow-lg flex justify-center items-center shadow-md relative">
          <a
            href="/"
            className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-gray-900"
          >
            <i className="fa fa-home"></i>
          </a>
        </div>
        <div className="h-10 bg-gradient-to-r from-blue-300 to-indigo-500 text-blue-900 text-md shadow-md p-2">
          Weather Report
        </div>

        <div className="p-4 text-black bg-gray-100 h-[100vh] overflow-y-auto">
          {selectedCity ? (
            // Detailed View for Selected City
            <div>
              <div className="mt-1 p-2 rounded-md shadow-lg flex justify-between items-center bg-white h-full mx-auto">
                <h2 className="text-2xl font-semibold text-center">
                  {selectedCity.name}
                </h2>
                <div className="h-full flex flex-col items-center justify-center rounded-md">
                  <p className="text-2xl text-indigo-700">Today</p>
                </div>

                <div className="flex flex-col justify-between items-center">
                  <p className="text-2xl text-indigo-700">
                    {selectedCity.main.temp} °C
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-md leading-6">
                    {selectedCity.weather[0].main}{' '}
                  </p>
                  <p className="text-md leading-6">
                    <img
                      src={`https://openweathermap.org/img/wn/${selectedCity.weather[0].icon}@2x.png`}
                      className="w-16 h-16 mb-4"
                    />
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-md leading-6">Wind Speed:</p>
                  <p className="text-md leading-6 text-indigo-700">
                    {selectedCity.wind.speed} m/s
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-md leading-6">Humidity: </p>
                  <p className="text-md leading-6 text-indigo-700">
                    {' '}
                    {selectedCity.main.humidity}%
                  </p>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="mt-3 md:full p-5 rounded-lg shadow-md bg-white">
                <h3 className="text-lg font-semibold text-center text-gray-800">
                  5-Day Forecast
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                  {forecastData?.list.map((day, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-2 rounded-xl shadow-lg text-black transition-transform transform hover:scale-105 hover:shadow-xl"
                    >
                      <div className="flex flex-col items-center justify-center">
                        {/* Date */}
                        <p className="text-sm font-semibold mb-2">
                          {new Date(day.dt * 1000).toLocaleDateString()}
                        </p>
                        {/* Weather Icon */}
                        <img
                          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                          alt={day.weather[0].description}
                          className="w-16 h-16 mb-4"
                        />

                        {/* Temperature */}
                        <p className="text-xl font-bold">{day.main.temp}°C</p>

                        {/* Weather Condition */}
                        <p className="text-sm italic mb-2">
                          {day.weather[0].description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Default View: List of City Weather Tiles
            <>
              <div className="md:w-full rounded-md shadow-lg bg-gray-200">
                <h2 className="text-md font-semibold p-4">City Weather</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 p-4">
                  {weatherData.map((weather) => (
                    <WeatherCard
                      key={weather.name}
                      city={weather.name}
                      temperature={weather.main.temp}
                      condition={weather.weather[0].main}
                      windSpeed={weather.wind.speed}
                      humidity={weather.main.humidity}
                      icon={weather.weather[0].icon}
                      onFavorite={toggleFavorite}
                      isFavorite={favoriteCities.includes(weather.name)}
                      onCityClick={() => handleCityClick(weather)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
