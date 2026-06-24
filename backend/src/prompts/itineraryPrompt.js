export const getItineraryPrompt = (extractedData) => `
You are an expert travel planner AI. Using the following booking information, generate a comprehensive day-by-day travel itinerary.

Booking Information:
${JSON.stringify(extractedData, null, 2)}

Generate a detailed JSON itinerary with this exact structure:
{
  "tripTitle": "A catchy title for this trip",
  "destination": "Primary destination",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "summary": "A brief 2-3 sentence overview of the trip",
  "totalEstimatedBudget": {
    "currency": "USD",
    "accommodation": 0,
    "food": 0,
    "transportation": 0,
    "activities": 0,
    "miscellaneous": 0,
    "total": 0
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "title": "Day theme/title",
      "activities": [
        {
          "time": "HH:MM",
          "type": "flight|hotel|transport|food|attraction|activity|rest",
          "title": "Activity name",
          "description": "Detailed description",
          "location": "Specific location/address",
          "duration": "Estimated duration",
          "estimatedCost": "Cost estimate",
          "icon": "✈️|🏨|🚗|🍽️|📍|🎯|😴",
          "tips": "Relevant tip for this activity"
        }
      ],
      "dailyBudget": {
        "estimated": 0,
        "breakdown": "Brief breakdown"
      }
    }
  ],
  "travelTips": [
    {
      "category": "Packing|Safety|Culture|Transportation|Food|Money|Weather",
      "tip": "Specific travel tip"
    }
  ],
  "emergencyInfo": {
    "localEmergency": "Emergency number",
    "nearestHospital": "If known",
    "embassy": "If applicable"
  }
}

Rules:
- Include ALL booked flights, hotels, trains, buses in the correct day/time
- Fill gaps between bookings with recommended activities, meals, and attractions
- Provide realistic time estimates and local recommendations
- Budget estimates should be reasonable for the destination
- Include 3-5 activities per day (not too packed, not too empty)
- Add food recommendations for breakfast, lunch, and dinner
- Suggest local transportation between activities
- Include cultural tips and local customs
- Return ONLY valid JSON, no markdown, no explanation
`;
