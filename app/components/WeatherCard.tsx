import React from 'react';

interface WeatherCardProps {
  city: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  icon: string;
  onFavorite: (city: string) => void;
  isFavorite: boolean;
  onCityClick: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temperature,
  condition,
  windSpeed,
  humidity,
  icon,
  onFavorite,
  isFavorite,
  onCityClick,
}) => {
  const iconLastChar = icon.charAt(icon.length - 1);
  const backgroundClass =
    iconLastChar === 'n'
      ? 'bg-gray-200'
      : iconLastChar === 'd'
      ? 'bg-sky-300'
      : '';
  const textClass =
    iconLastChar === 'n'
      ? 'text-blue-900'
      : iconLastChar === 'd'
      ? 'text-black'
      : '';

  return (
    <div
      className={`relative w-full p-5 border rounded-xl shadow-xl ${backgroundClass} max-h-[250px] min-h-[200px] transition-all duration-300 ease-in-out group flex items-center cursor-pointer`}
      style={{
        backgroundImage: `url(https://openweathermap.org/img/wn/${icon}@2x.png)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      }}
      onClick={onCityClick}
    >
      <h2
        className={`text-lg font-bold ${textClass} absolute top-0 left-1/3 mt-4 z-10 group-hover:hidden`}
      >
        {city}
      </h2>

      <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-black bg-opacity-60 text-white p-4 rounded-xl pt-12">
        <p className="text-xl leading-10">{temperature} °C</p>
        <p className="text-sm leading-6">{condition}</p>
        <p className="text-xs leading-6">Wind Speed: {windSpeed} m/s</p>
        <p className="text-xs leading-6">Humidity: {humidity}%</p>

        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(city);
            }}
            title={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
          >
            {!isFavorite ? '🤍' : '❤️'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
