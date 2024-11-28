const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());

// Add root path handler
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Specific weather route with explicit query handling
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    // Existing weather API logic
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    res.json({
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      cityName: response.data.name
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error fetching weather data',
      details: error.message 
    });
  }
});

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});