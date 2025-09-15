import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWeatherByCoords } from "@/api/WeatherApi/weatherApi";
import { fetchLocation } from "@/api/LocationApi/locationApi";
import { Spin, Image, Button, Card, Input } from "antd";
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaClock, FaSearchLocation, FaWind } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";
import { FaLocationDot, FaTemperatureHalf } from "react-icons/fa6";
import { NotificationInstance } from "antd/es/notification/interface";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { bgImage } from "@/custom/backgroundTransiton"
import { MdMyLocation } from "react-icons/md";

interface WeatherProps {
  notify: NotificationInstance;
}

export default function WeatherWidget({ notify }: WeatherProps) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [address, setAddress] = useState("");
  const [displayName, setDisplayName] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get GPS coords
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lon: longitude });

          try {
            const addrRes = await fetchLocation({ lat: latitude, lon: longitude });
            setDisplayName(addrRes.formattedAddress);
          } catch {
            setDisplayName("Unable to determine address");
          }
        },
        () => {
          console.warn("Failed to get GPS location");
        }
      );
    }
  }

  const { data: weatherData, isLoading } = useQuery({
    queryKey: ["weather", coords],
    queryFn: () => fetchWeatherByCoords(coords!.lat, coords!.lon),
    enabled: !!coords,
  });

  const geocodeMutation = useMutation({
    mutationFn: (addr: string) => fetchLocation({ address: addr }),
    onSuccess: (res) => {
      setCoords(res.location);
      setDisplayName(res.formattedAddress);
    },
    onError: () => {
      console.error("Address not found!");
      notify.error({
        message: "Error",
        description: "Address not found!",
      })
    },
  });

  const handleSearch = () => {
    if (address.trim()) {
      geocodeMutation.mutate(address);
    } else {
      notify.warning({
        message: "Warning",
        description: "Please fill your blank!",
      });
      return;
    }
  };

  return (
    <div className="flex justify-center mt-6 mb-6">
      <Card className="w-full max-w-3xl rounded-2xl p-4 weather"
        style={{
          backgroundImage: bgImage(),
        }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2 w-full text-cyan-300">
            <TiWeatherPartlySunny className="text-3xl" />
            <h2 className="font-bold text-xl">Weather Widget</h2>
          </div>

          <Input
            placeholder="Enter address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onPressEnter={handleSearch}
            className="rounded-xl"
          />

          <Button
            type="primary"     
            size="middle"
            shape="round"       
            onClick={handleSearch}
            loading={geocodeMutation.isPending}
            icon={<FaSearchLocation className="!text-red-400 hover:scale-150 transition-all delay-75" />}
            className="!bg-white hover:bg-blue-600 border-none scale-110"
          />

          <Button 
            type="primary"
            size="middle"
            shape="round"
            onClick={getLocation}
            icon={<MdMyLocation className="!text-red-400 hover:scale-150 transition-all delay-75" />}
            className="!bg-white hover:bg-blue-600 border-none scale-110" 
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : weatherData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center justify-center">
              <Image
                alt="icon"
                width={90}
                preview={false}
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              />
              <p className="text-4xl font-bold mt-2">
                {Math.round(weatherData.main.temp)}°C
              </p>
              <p className="capitalize text-shadow-white text-lg">
                {weatherData.weather[0].description}
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start text-white font-bold">
              <div className="flex items-center mb-2 gap-2">
                <FaLocationDot className="text-2xl text-red-500 animate-bounce" />
                <p className="text-yellow-400 font-bold text-xl">{displayName || "Get your location..."}</p>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <FaClock className="text-green-500" />
                <p className="text-white font-mono mt-1">{time || "Get local time..."}</p>
              </div>
              <div className="mt-3 space-y-2 text-lg">
                <div className="flex items-center gap-2">
                  <FaWind className="text-blue-500" />
                  <span>{weatherData.wind.speed} m/s</span>
                </div>

                <div className="flex items-center gap-2">
                  <IoIosWater className="text-cyan-500" />
                  <span>{weatherData.main.humidity}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaTemperatureHalf className="text-red-500" />
                  <span>~{Math.round(weatherData.main.feels_like)}°C</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaArrowAltCircleDown className="text-blue-600" />
                  <span>{Math.round(weatherData.main.temp_min)}°C</span>
                  <FaArrowAltCircleUp className="text-red-600 ml-3" />
                  <span>{Math.round(weatherData.main.temp_max)}°C</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">No data available</p>
        )}
      </Card>
    </div>
  );
}
