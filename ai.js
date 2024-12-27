const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios'); 
const readline = require('readline'); 

const genAI = new GoogleGenerativeAI("Your_Gemini_API"); //your Gemini API
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Add your OpenWeatherMap API key here
const weatherApiKey = 'Your_Weather_Api';

async function getWeather(location) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`;
    try {
        const response = await axios.get(weatherApiUrl);
        const weather = response.data;
        return `The weather in ${location} is ${weather.weather[0].description} with a temperature of ${weather.main.temp}°C.`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return 'Unable to fetch weather data at the moment.';
    }
}

async function generateContent(prompt) {
    const location = prompt.split(' ').slice(-1)[0]; // Extract the location from the prompt
    const weatherInfo = await getWeather(location);
    const result = await model.generateContent(`${prompt}. ${weatherInfo}`);
    console.log(result.response.text());
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter your prompt: ', (prompt) => {
    generateContent(prompt);
    rl.close();
});