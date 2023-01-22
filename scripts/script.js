const link = "http://api.weatherstack.com/current?access_key=e17e90a1e5ef27e7eca6bb7c977ead36"

const selectors = {
    day: document.querySelector(".location__info-day"),
    date: document.querySelector(".location__info-date"),
    place: document.querySelector(".location__info-place-name"),
    weather_img: document.querySelector(".location__weather-icon"),
    temperature: document.querySelector(".location__weather-temperature"),
    weather_description: document.querySelector(".location__weather-descriprion")
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
    humidity: 0,
    wind_dir: "",
    wind_speed: 0
}


const fetchData = async () => {
    const weatherResult = await fetch(`${link}&query=${store.city}`);
    const weatherData = await weatherResult.json();

    const {
        current: {
            cloudcover,
            feelslike,
            humidity,
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
}

const getDayName = () => {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

fetchData();