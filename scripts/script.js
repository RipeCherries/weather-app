const link = "http://api.weatherstack.com/current?access_key=e17e90a1e5ef27e7eca6bb7c977ead36"

const selectors = {
    day: document.querySelector(".location__info-day"),
    date: document.querySelector(".location__info-date"),
    place: document.querySelector(".location__info-place-name")
}

let store = {
    country: "Russia",
    countryCode: "RU",
    city: "Novosibirsk",
    localTime: ""
}


const fetchData = async () => {
    const weatherResult = await fetch(`${link}&query=${store.city}`);
    const weatherData = await weatherResult.json();

    const {
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
        localTime: localtime
    };

    render();
}

const render = () => {
    selectors.day.innerHTML = getDayName();
    selectors.date.innerHTML = getFullData();
    selectors.place.innerHTML = getPlaceName();
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

fetchData();