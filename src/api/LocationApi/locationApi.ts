import axios from "axios";

const GOONG_API_KEY = process.env.NEXT_PUBLIC_GOONG_API_KEY;

export const fetchLocation = async (
    params: { address: string } | { lat: number; lon: number },
    lang: string = "en"
) => {
    try {
        // Case 1: Address → Coordinates
        if ("address" in params) {
            const res = await axios.get("https://rsapi.goong.io/geocode", {
                params: { address: params.address, api_key: GOONG_API_KEY },
            });

            if (res.data?.results?.length > 0) {
                const loc = res.data.results[0].geometry.location;
                return {
                    location: { lat: loc.lat, lon: loc.lng },
                    formattedAddress: res.data.results[0].formatted_address,
                };
            }

            throw new Error("Address not found!");
        }

        // Case 2: Coordinates → Address
        if ("lat" in params && "lon" in params) {
            const res = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${params.lat}&lon=${params.lon}&format=json&accept-language=${lang}`
            );

            const address = res.data.address;
            const district =
                address.suburb ||
                address.district ||
                address.county ||
                address.town ||
                address.village;

            const city = address.city || address.state || "";

            const shortAddress = district && city ? `${district}, ${city}` : res.data.display_name;

            return {
                location: { lat: params.lat, lon: params.lon },
                formattedAddress: shortAddress,
            };
        }

        throw new Error("Invalid parameters!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("fetchLocation error:", err.message || err);
        throw new Error(err.message || "Failed to fetch location");
    }
};
