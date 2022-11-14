/* Global Variables */
// Personal API Key for OpenWeatherMap API
const API_KEY = `&appid=${user_key}&units=metric`;
const API_BASE = 'https://api.openweathermap.org/data/2.5/weather?';

// Select HTML elements
const ZIP_CODE = document.querySelector('#zip');
const COUNTRY = document.querySelector('#country');
const FEELINGS = document.querySelector('#feelings');
const GENERATE = document.querySelector('#generate');
const DATE = document.querySelector('#date');
const TEMP = document.querySelector('#temp');
const CONTENT = document.querySelector('#content');

// User data object
const USER_DATA = {};

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) + '.' + d.getDate()+ '.' + d.getFullYear();

/* Function called by event listener */
// Use fetch() to make a GET request to the OpenWeatherMap API
const getWeatherData = async (url = '', data = {}) => {

    // API URL
    const zipCode = `zip=${ZIP_CODE.value},`;
    const countryCode = `${(COUNTRY.value).toLowerCase()}`;
    
    /* Function to GET Web API Data */
    const response = await fetch(API_BASE + zipCode + countryCode + API_KEY);
    try {
        const newData = await response.json();

        // Values from user to USER_DATA object
        USER_DATA.zipCode = ZIP_CODE.value;
        USER_DATA.country = COUNTRY.value;
        USER_DATA.feelings = FEELINGS.value;
        USER_DATA.temperature = `${(newData.main.temp - 273.15).toFixed(1)} °C`;
        USER_DATA.date = newDate;

        // POST function
        POSTData('/projectData', USER_DATA)
            .then(retrieveData());
    } catch (error) {
        console.log("error", error);
        alert("Make sure to fill all blanks properly.");
    }
}

// POST data to the server
/* Function to POST data */
const POSTData = async (url = '', data = {}) => {
    // console.log(data);

    // post data
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data),
    });
    try {
        const newData = await response.json();
        // console.log(newData);
    } catch (error) {
        console.log("error", error);
        alert("Something went wrong please try again later");
    }
}

// GET Project Data
/* Function to GET Project Data */
const retrieveData = async () =>{

    const request = await fetch('/projectData');
    try {
        // Transform into JSON
        const allData = await request.json();
        console.log(allData);
        if (allData.temperature !== undefined) {
            // Write updated data to DOM elements
            TEMP.innerHTML = allData.temperature;
            CONTENT.innerHTML = allData.feelings;
            DATE.innerHTML = allData.date;
        }
    }
    catch(error) {
        console.log("error", error);
        // appropriately handle the error
        alert('Something went wrong please try again later');
    }
}

// Event listener to add function to existing HTML DOM element
GENERATE.addEventListener('click', getWeatherData, false);