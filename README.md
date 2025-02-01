This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

## Clone the repository

git clone https://github.com/VaidekiM/stackblitz-starters-18ysph3q

## Install Dependencies

npm install

## Setup Environment Variables

Create .env.local in the root folder and add:
NEXT_PUBLIC_WEATHER_API_KEY=the_api_that_is_generated_from_openweathermap

## Run the project

npm run dev

## Project Structure

weather-dashboard/
app/
page.tsx # Main home page
globals.css
app/components/ # Tailwind CSS
CitySearch.tsx # Search input for cities
WeatherCard.tsx # Weather tile component  
 app/utils/
weather.ts # API fetch functions
public/
.env.local # API keys
README.md # Project documentation
package.json # Dependencies and scripts

## Interaction with API

Requesting the data:
The app sends a request to the OpenWeather API using HTTP methods (to achieve this, I used axios library)
The API URL includes the necessary parameters, such as the city name, the API key, and any optional parameters

Sending parameters and receiving data:
Parameters like the city name, apiid is sent and respective weather data is received in JSON format

Displaying data:
The application processes the received JSON data and extracts the relevant data which is then displayed on the user interface.
