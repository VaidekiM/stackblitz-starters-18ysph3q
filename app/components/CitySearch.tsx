import React, { useState } from 'react';

interface CitySearchProps {
  onSearch: (city: string) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (city.trim() === '') {
      setError('Please enter a city name');
      return;
    }

    onSearch(city);
    setCity('');
    setError('');
  };

  return (
    <div className="">
      <div className="flex sm:w-auto w-full gap-1 m-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="text-sm p-2 border rounded-md text-black flex-grow shadow-md"
        />
        <button
          onClick={handleSearch}
          className="text-sm p-2 bg-blue-500 text-white rounded-md flex items-center"
        >
          <i className="fa fa-search"></i> {/* Font Awesome Search Icon */}
        </button>
      </div>
      <div className="">
        {error && <p className="text-red-500 text-sm m-4">{error}</p>}
      </div>
    </div>
  );
};

export default CitySearch;
