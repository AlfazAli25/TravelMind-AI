// Extraction prompt — used to convert raw text into structured booking data
export const getExtractionPrompt = (rawText) => `
You are a travel document data extraction AI. Analyze the following text extracted from a travel booking document and extract all relevant booking information.

Return a valid JSON object with this exact structure:
{
  "destination": "Primary destination city/country",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "flights": [
    {
      "airline": "",
      "flightNumber": "",
      "departure": { "airport": "", "city": "", "date": "", "time": "" },
      "arrival": { "airport": "", "city": "", "date": "", "time": "" },
      "class": "",
      "pnr": "",
      "passengers": []
    }
  ],
  "hotels": [
    {
      "name": "",
      "address": "",
      "checkIn": "",
      "checkOut": "",
      "roomType": "",
      "confirmationNumber": "",
      "guests": []
    }
  ],
  "trains": [
    {
      "trainNumber": "",
      "operator": "",
      "departure": { "station": "", "city": "", "date": "", "time": "" },
      "arrival": { "station": "", "city": "", "date": "", "time": "" },
      "class": "",
      "pnr": "",
      "passengers": []
    }
  ],
  "buses": [
    {
      "operator": "",
      "busNumber": "",
      "departure": { "station": "", "city": "", "date": "", "time": "" },
      "arrival": { "station": "", "city": "", "date": "", "time": "" },
      "seatNumber": "",
      "pnr": ""
    }
  ],
  "bookings": [
    {
      "type": "",
      "name": "",
      "date": "",
      "time": "",
      "confirmationNumber": "",
      "details": ""
    }
  ]
}

Rules:
- Extract ONLY information that is explicitly present in the text
- Use empty arrays for categories with no data
- Use empty strings for missing fields, not null
- Dates must be in YYYY-MM-DD format
- Times must be in HH:MM format (24-hour)
- Return ONLY the JSON object, no markdown formatting, no explanation

Document text:
"""
${rawText}
"""
`;

export const getVisionExtractionPrompt = () => `
You are a travel document data extraction AI. Analyze this image of a travel booking document (ticket, confirmation, receipt, etc.) and extract all relevant booking information you can see.

Return a valid JSON object with this exact structure:
{
  "destination": "Primary destination city/country",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "flights": [],
  "hotels": [],
  "trains": [],
  "buses": [],
  "bookings": []
}

Each flight should have: airline, flightNumber, departure (airport, city, date, time), arrival (airport, city, date, time), class, pnr, passengers
Each hotel should have: name, address, checkIn, checkOut, roomType, confirmationNumber, guests
Each train should have: trainNumber, operator, departure (station, city, date, time), arrival (station, city, date, time), class, pnr, passengers
Each bus should have: operator, busNumber, departure (station, city, date, time), arrival (station, city, date, time), seatNumber, pnr
Each booking should have: type, name, date, time, confirmationNumber, details

Rules:
- Extract ONLY information visible in the image
- Use empty arrays for categories with no data
- Use empty strings for missing fields
- Dates in YYYY-MM-DD format, times in HH:MM (24-hour)
- Return ONLY valid JSON, no markdown, no explanation
`;
