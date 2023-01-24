const link = "http://api.weatherstack.com/current?access_key=e17e90a1e5ef27e7eca6bb7c977ead36"

const selectors = {
    day: document.querySelector(".location__info-day"),
    date: document.querySelector(".location__info-date"),
    place: document.querySelector(".location__info-place-name"),
    weather_img: document.querySelector(".location__weather-icon"),
    temperature: document.querySelector(".location__weather-temperature"),
    weather_description: document.querySelector(".location__weather-descriprion"),
    weather_info: document.querySelector(".weather__info")
}

let store = {
    country: "Russia",
    countryCode: "RU",
    city: "Novosibirsk",
    localTime: "",
    temperature: 0,
    feelslike: 0,
    description: "",
    cloudcover: 0,
    precipitation: 0,
    humidity: 0,
    wind_dir: "",
    wind_speed: 0
}


const fetchData = async () => {
    const weatherResult = await fetch(`${link}&query=${store.city}`);
    const weatherData = await weatherResult.json();

    console.log(weatherData);

    const {
        current: {
            cloudcover,
            feelslike,
            humidity,
            precip,
            temperature,
            weather_descriptions,
            wind_dir,
            wind_speed
        },
        location: {
            country,
            localtime,
            name
        }
    } = weatherData;

    const codeResult = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    const codeData = await codeResult.json();

    const {
        cca2
    } = codeData[0];

    store = {
        ...store,
        country: country,
        countryCode: cca2,
        city: name,
        localTime: localtime,
        temperature: temperature,
        feelslike: feelslike,
        description: weather_descriptions[0],
        cloudcover: cloudcover,
        precipitation: precip,
        humidity: humidity,
        wind_dir: wind_dir,
        wind_speed: wind_speed
    };

    render();
}

const render = () => {
    selectors.day.innerHTML = getDayName();
    selectors.date.innerHTML = getFullData();
    selectors.place.innerHTML = getPlaceName();

    selectors.weather_img.src = `assets/icons/${getImage()}`;
    selectors.temperature.innerHTML = getTemperature();
    selectors.weather_description.innerHTML = getWeatherDescription();

    selectors.weather_info.innerHTML = getWeatherInfo();
}

const getDayName = () => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return dayNames[new Date(store.localTime).getDay()];
}

const getFullData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    const d = new Date(store.localTime);

    return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
}

const getPlaceName = () => {
    return store.city + ", " + store.countryCode; 
}

const getImage = () => {
    const value = store.description.toLowerCase();

    if (value.includes("snow")) {
        return "snowly.svg";
    } else if (value.includes("sunny")) {
        return "sunny.svg";
    }
}

const getTemperature = () => {
    return "" + store.temperature + " °C";
}

const getWeatherDescription = () => {
    return store.description.split(",")[0];
}

const getWeatherInfo = () => {
    return `
        <div class="weather__info-feelslike">
            <div class="weather__info-name">FEELS LIKE</div>
            <div class="weather__info-value">${store.feelslike} °C</div>
        </div>
        <div class="weather__info-cloudcover">
            <div class="weather__info-name">CLOUD COVER</div>
            <div class="weather__info-value">${store.cloudcover} %</div>
        </div>
        <div class="weather__info-precipitation">
            <div class="weather__info-name">PRECIPITATION</div>
            <div class="weather__info-value">${store.precipitation * 100} %</div>
        </div>
        <div class="weather__info-humidity">
            <div class="weather__info-name">HUMIDITY</div>
            <div class="weather__info-value">${store.humidity} %</div>
        </div>
        <div class="weather__info-wind">
            <div class="weather__info-name">WIND</div>
            <div class="weather__info-value">${store.wind_dir} ${store.wind_speed} km/h</div>
        </div>
    `;
}

fetchData();