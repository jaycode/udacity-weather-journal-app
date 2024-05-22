/* Global Variables */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '416f68ab5e66a91f0a10192552d1364a&units=imperial';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    getWeather(baseURL, zip, apiKey)
        .then(function (data) {
            // Log data to the browser console (for debugging)
            console.log('Weather data received:', data);
            
            // Add data to POST request
            postData('/add', { temperature: data.main.temp, date: newDate, userResponse: feelings });
        })
        .then(function () {
            // Call updateUI to update browser content
            retrieveData();
        });
}

// Async GET
const getWeather = async (baseURL, zip, key) => {
    const res = await fetch(baseURL + zip + ',us&appid=' + key);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

// Async POST
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log('error', error);
    }
};

// Update UI
const retrieveData = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        document.getElementById('temp').innerHTML = `Temperature: ${allData.temperature}°C`;
        document.getElementById('content').innerHTML = `Feeling: ${allData.userResponse}`;
        document.getElementById('date').innerHTML = `Date: ${allData.date}`;
    } catch (error) {
        console.log('error', error);
    }
};
