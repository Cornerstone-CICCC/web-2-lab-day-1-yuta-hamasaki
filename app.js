const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

const showLocation = document.getElementById("location")
const showTemp = document.getElementById("temprature")
const countryName = document.getElementById("countryName")
const showTimeZone = document.getElementById("showTimeZone")
const showPopulation = document.getElementById(" showPopulation")
const showMin = document.getElementById("min")
const showMax = document.getElementById("max")
const notFound = document.getElementById("not-found")
const img = document.querySelector("#top-container")

async function getCityInfo(city){
  try{
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)

  if(!res.ok){
    console.log("failed getting data")
  }

  const cityInfoData = await res.json()
  const cityInfo = cityInfoData.results[0]
  return cityInfo
} catch (err){
  console.error(err.message)
}
}

async function getWeather(lat, long){
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
    if(!res.ok){
      console.log("failed getting data", err)
    }

    const weatherRaw = await res.json()
    // console.log(weatherRaw)
    return weatherRaw
  } catch (err) {
    console.error("faild getting weather data", err)
  }
}


function dayOrNight(isDay){
  return isDay ? "https://images.unsplash.com/photo-1419833173245-f59e1b93f9ee?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : "https://images.unsplash.com/photo-1482385916434-814664df9c5b?q=80&w=2593&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}

async function showData() {
  try{
    const city = cityInput.value || "Vancouver";
    const cityData = await getCityInfo(city);
    const weatherData = await getWeather(cityData.latitude, cityData.longitude);

    
    showLocation.innerHTML = cityData.name;
    showTemp.innerHTML = `${weatherData.current.temperature_2m} °C`;
    countryName.innerHTML = cityData.country;
    showTimeZone.innerHTML = weatherData.timezone;
    showPopulation.innerHTML = cityData.population || "N/A";
    showMax.innerHTML = `Max: ${weatherData.daily.temperature_2m_max[0]} °C`;
    showMin.innerHTML = `Min: ${weatherData.daily.temperature_2m_min[0]} °C`;
    notFound.innerHTML = ""
    img.style.backgroundImage = `url(${dayOrNight(weatherData.current.is_day)})`
  }catch(err){
  notFound.innerHTML = "Information not found"
  }
}

searchBtn.addEventListener("click", showData);
