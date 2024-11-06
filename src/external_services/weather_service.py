import requests
from fastapi import HTTPException

async def check_weather_impact(lat, lon, date, api_key):
    url = f"https://api.openweathermap.org/data/2.5/onecall/timemachine"
    params = {"lat": lat, "lon": lon, "dt": date, "appid": api_key}

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if "rain" in data["current"]["weather"][0]["description"]:
            return "Excused - Weather Delay"
    else:
        raise HTTPException(status_code=500, detail="Weather API request failed")
