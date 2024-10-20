const apiKey = "5ca62e9c197b0a7735ae7e17fe3d43b3";

const cepInput = document.querySelector("#cep-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

// Loader
const toggleLoader = () => {
    loader.classList.toggle("hide");
};

// Função para buscar dados do clima
const getWeatherData = async (city) => {
    toggleLoader();

    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    const res = await fetch(apiWeatherURL);
    const data = await res.json();

    toggleLoader();

    return data;
};

// Função para buscar dados do CEP
const getCepData = async (cep) => {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const res = await fetch(url);
    const data = await res.json();

    return data;
};

// Tratamento de erro
const showErrorMessage = () => {
    errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
    errorMessageContainer.classList.add("hide");
    weatherContainer.classList.add("hide");
};

const showWeatherData = async (cep) => {
    hideInformation();

    const cepData = await getCepData(cep);
    
    if (cepData.erro) {
        showErrorMessage();
        return;
    }

    const city = cepData.localidade;

    const weatherData = await getWeatherData(city);

    if (weatherData.cod === "404") {
        showErrorMessage();
        return;
    }

    cityElement.innerText = weatherData.name;
    tempElement.innerText = Math.round(weatherData.main.temp);
    descElement.innerText = weatherData.weather[0].description;
    weatherIconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`
    );
    countryElement.setAttribute("src", `https://flagcdn.com/16x12/${weatherData.sys.country.toLowerCase()}.png`);
    umidityElement.innerText = `${weatherData.main.humidity}%`;
    windElement.innerText = `${weatherData.wind.speed} km/h`;

    weatherContainer.classList.remove("hide");
};

searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const cep = cepInput.value.trim();

    if (cep) {
        showWeatherData(cep);
    }
});

cepInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        const cep = e.target.value.trim();
        if (cep) {
            showWeatherData(cep);
        }
    }
});
document.getElementById('back-link').addEventListener('click', function() {
    window.history.back(); // Volta para a página anterior
});
