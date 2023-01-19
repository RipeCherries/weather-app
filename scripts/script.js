const link = "http://api.weatherstack.com/current?access_key=e17e90a1e5ef27e7eca6bb7c977ead36"

const fetchData = async () => {
    const result = await fetch(`${link}&query=${store.city}`);
    const data = await result.json();

    const {
        current: {
            temperature,
            weather_descriptions
        },

        location: {
            country,
            localtime,
            name
        }
    } = data;
}

fetchData();