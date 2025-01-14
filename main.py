import random
from amadeus import Client, ResponseError
import os
import certifi

# Configure Python to use updated SSL certificates
os.environ['SSL_CERT_FILE'] = certifi.where()

# Initialize the Amadeus client
amadeus = Client(
    client_id="BAsFVPgNtKMM9E6v9DahzilctL9xB5Jc",
    client_secret="d6awkC2fGUjd1Rmw"
)

def get_airport_code(city_name):
    try:
        print(f"Fetching airport code for {city_name}...")
        response = amadeus.reference_data.locations.cities.get(keyword=city_name)
        if response.data:
            # Check if city code exists in the response data
            city_info = response.data[0]
            city_code = city_info.get('iataCode', None)  # Look for the airport code
            if city_code:
                return city_code
            else:
                print(f"No airport code found for {city_name}.")
                return None
        else:
            print(f"No cities found for {city_name}.")
            return None
    except ResponseError as error:
        print(f"Error fetching airport code: {error}")
        return None

def get_flight_offers(origin, budget, departure_date, return_date, adults, children, infants):
    try:
        print("Fetching flight offers...")
        # Use the correct airport code (e.g., JFK for New York)
        origin_location_code = get_airport_code(origin)  # Get the airport code based on city
        
        if not origin_location_code:
            print("Invalid city name provided. Cannot fetch flight offers.")
            return None
        
        # Ensure budget is a valid integer
        max_price = str(budget)  # Ensure the budget is just a number (no $ or commas)
        
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode=origin_location_code,
            maxPrice=max_price,
            departureDate=departure_date,
            returnDate=return_date,
            adults=adults,
            children=children,
            infants=infants
        )
        
        return response.data
    except ResponseError as error:
        print(f"Error fetching flight offers: {error}")
        return None



def get_hotel_offers(destination, check_in_date, check_out_date, total_people):
    try:
        print("Fetching hotel offers...")
        response = amadeus.shopping.hotel_offers.get(
            cityCode=destination,
            checkInDate=check_in_date,
            checkOutDate=check_out_date,
            adults=total_people
        )
        return response.data
    except ResponseError as error:
        print(f"Error fetching hotel offers: {error}")
        return None

def get_tours_and_activities(latitude, longitude):
    try:
        print("Fetching tours and activities...")
        response = amadeus.shopping.activities.get(
            latitude=latitude,
            longitude=longitude
        )
        return response.data
    except ResponseError as error:
        print(f"Error fetching tours and activities: {error}")
        return None

def get_weather(location):
    try:
        print("Fetching weather information...")
        response = amadeus.reference_data.locations.points_of_interest.get(
            keyword=location,
            subType='CITY'
        )
        return response.data
    except ResponseError as error:
        print(f"Error fetching weather: {error}")
        return None

def suggest_random_destination(flight_offers):
    destinations = [
        flight['itineraries'][0]['segments'][-1]['arrival']['iataCode']
        for flight in flight_offers
    ]
    return random.choice(destinations) if destinations else None

def main():
    # Gather user inputs
    print("Welcome to the Vacation Planner!")
    starting_location = input("Enter your starting location (city name, e.g., New York): ").strip()
    destination_preference = input("Enter destination preference (same-state, same-country, world): ").strip()
    budget = int(input("Enter your budget (in USD): ").strip())
    from_date = input("Enter your departure date (YYYY-MM-DD): ").strip()
    to_date = input("Enter your return date (YYYY-MM-DD): ").strip()

    # Gather number of travelers by age group
    print("\nEnter the number of travelers:")
    adults = int(input("Adults (18-64): ").strip())
    children = int(input("Children (2-11): ").strip())
    infants = int(input("Infants (under 2): ").strip())
    seniors = int(input("Seniors (65+): ").strip())
    total_people = adults + children + seniors  # Infants are typically not counted for hotels

    # Fetch flight offers
    flight_offers = get_flight_offers(
        origin=starting_location,
        budget=budget,
        departure_date=from_date,
        return_date=to_date,
        adults=adults,
        children=children,
        infants=infants
    )

    if not flight_offers:
        print("No flight offers available within your budget.")
        return

    # Suggest a random destination
    suggested_destination = suggest_random_destination(flight_offers)
    if not suggested_destination:
        print("No destinations could be suggested.")
        return

    # Ask user for confirmation
    print(f"\nSuggested Destination: {suggested_destination}")
    user_response = input("Do you accept this suggestion? (yes/no): ").strip().lower()

    if user_response != "yes":
        print("Okay, we won't proceed with this destination. Run the program again to retry.")
        return

    # Fetch hotel offers
    hotel_offers = get_hotel_offers(
        destination=suggested_destination,
        check_in_date=from_date,
        check_out_date=to_date,
        total_people=total_people
    )

    # Fetch tours and activities (Mock location data for now)
    latitude, longitude = 40.7128, -74.0060  # Replace with actual latitude/longitude
    tours_and_activities = get_tours_and_activities(latitude=latitude, longitude=longitude)

    # Fetch weather information
    weather_info = get_weather(location=suggested_destination)

    # Display all results
    print("\n--- Final Details for Your Vacation ---")
    print(f"Destination: {suggested_destination}")

    # Flights
    print("\nFlight Offers:")
    for flight in flight_offers[:5]:  # Limit to 5 offers for readability
        print(f"- Price: {flight['price']['total']}, Departure: {flight['itineraries'][0]['segments'][0]['departure']['iataCode']}")

    # Hotels
    if hotel_offers:
        print("\nHotel Offers:")
        for hotel in hotel_offers[:5]:  # Limit to 5 hotels
            print(f"- {hotel['hotel']['name']}, Price: {hotel['offers'][0]['price']['total']}")
    else:
        print("No hotel offers available.")

    # Tours and Activities
    if tours_and_activities:
        print("\nTours and Activities:")
        for activity in tours_and_activities[:5]:  # Limit to 5 activities
            print(f"- {activity['name']}: {activity['shortDescription']}")
    else:
        print("No tours and activities available.")

    # Weather
    if weather_info:
        print("\nWeather Information:")
        for weather in weather_info[:5]:  # Limit to 5 items
            print(f"- {weather['name']}: {weather['detailedDescription']}")
    else:
        print("No weather information available.")

if __name__ == "__main__":
    main()
