import { useState } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

const api = {
    key: "96c38b65f2115f021a164d9909da13e1",
    base: "https://api.openweathermap.org/data/2.5/",
};

const arr = [
    {
        id: 0,
        name: "Sunrise",
        value:  this.weather && this.weather.sys && this.weather.sys.sunrise 
    },
    {
        id: 1,
        name: "Sunset",
        // value: this.weather.sys.sunset
        value: ""
    },
]

function App() {
    const [query, setQuery] = useState("");
    const [weather, setWeather] = useState({});
    const [airPollution, setAirPollution] = useState({})

    const search = evt => {
        if (evt.key === "Enter") {
            fetch(`${api.base}weather?q=${query}&appid=${api.key}`)
                .then(res => res.json())
                .then(result => {
                    setWeather(result)
                    setQuery("")
                    searchAirPoll(result);
                    console.log("Current weather result", result)
                })
        }
    }

    const searchAirPoll = (data) => {
        fetch(`${api.base}air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${api.key}`)
            .then(res => res.json())
            .then(result => {
                setAirPollution(result)
                console.log("Air pollution result", result)
            })
    }

    const dateBuilder = (d) => {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day} ${date} ${month} ${year}`
    }
    return (
        <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 0) ? 'app snowy' : 'app') : 'app'}>
            <main className="main">

                <div className="search-box">
                    <input
                        onChange={e => setQuery(e.target.value)}
                        value={query}
                        onKeyPress={search}
                        type="text" className="search-bar" placeholder="Search..." />
                </div>

                {(typeof weather.main != 'undefined') ? (
                    <div>
                        <div className="temp-box">
                            <div className="temp">
                                {Math.round(weather.main.temp)}°c
                            </div>
                            <div className="weather-desc">{weather.weather[0].description}</div>
                        </div>
                    </div>
                ) : ('')}
            </main>
            {(typeof weather.main != 'undefined' && typeof airPollution.list != 'undefined') ? (

                <div className="weather-box">
                    <div className="weather-info">
                        <p className="date">{dateBuilder(new Date())}</p>
                        <p className="location">{weather.name}, {weather.sys.country}</p>
                        <p>{airPollution.list[0].main.aqi}</p>
                    </div>

                    <div className="air-pollution">
                        <h3 className="air-pollution__title">Air Pollution</h3>
                        <InputRange
                            maxValue={5}
                            minValue={1}
                            value={airPollution.list[0].main.aqi}
                        />
                    </div>

                    <div className="detailed-weather-info">

                        <div></div>

                        <ul>
                            {arr.map(d => (
                                <li key={d.id}>{d.name}, {d.value}</li>
                            ))}
                        </ul>

                    </div>
                </div>
            ) : ('')}
        </div>
    );
}

export default App;
