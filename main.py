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

def format_flight_data(flight_data):
    """Formats and prints flight data."""
    for i, flight in enumerate(flight_data, 1):
        print(f"Flight {i}:")
        print(f"  Airline: {flight['airline']}")
        print(f"  Departure: {flight['departure_city']} ({flight['departure_airport']})")
        print(f"  Destination: {flight['arrival_city']} ({flight['arrival_airport']})")
        print(f"  Departure Time: {flight['departure_time']}")
        print(f"  Arrival Time: {flight['arrival_time']}")
        print(f"  Duration: {flight['duration']}")
        print(f"  Price: {flight['price']} {flight['currency']}")
        print("-" * 50)

def flight_offers_search():
    """Fetches flight offers and formats the output."""
    try:
        # Collect user inputs
        origin = input("Please enter an origin location code: ")
        destination = input("Please enter a destination location code: ")
        departure_date = input("Please enter a departure date in the YYYY-MM-DD format: ")
        adults = int(input("The number of adult passengers with age 12 or older: "))

        # API call
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode=origin,
            destinationLocationCode=destination,
            departureDate=departure_date,
            adults=adults
        )

        # Parse the response
        flights = response.data
        if not flights:
            print("No flights found.")
            return

        # Extract and format the relevant details
        formatted_data = []
        for flight in flights:
            itinerary = flight['itineraries'][0]
            first_segment = itinerary['segments'][0]
            last_segment = itinerary['segments'][-1]

            formatted_data.append({
                "airline": first_segment['carrierCode'],
                "departure_city": first_segment['departure']['iataCode'],
                "departure_airport": first_segment['departure']['iataCode'],
                "arrival_city": last_segment['arrival']['iataCode'],
                "arrival_airport": last_segment['arrival']['iataCode'],
                "departure_time": first_segment['departure']['at'],
                "arrival_time": last_segment['arrival']['at'],
                "duration": itinerary['duration'],
                "price": flight['price']['grandTotal'],
                "currency": flight['price']['currency']
            })

        # Print the formatted flight data
        format_flight_data(formatted_data)
    except ResponseError as error:
        print(f"Error fetching flight details: {error}")
        return None

def format_hotel_data(hotel_data):
    """Formats and prints hotel data."""
    for i, hotel in enumerate(hotel_data, 1):
        print(f"Hotel {i}:")
        print(f"  Name: {hotel.get('name', 'N/A')}")
        address_lines = hotel['address'].get('lines', ['N/A'])[0] if 'address' in hotel else 'N/A'
        city_name = hotel['address'].get('cityName', 'N/A') if 'address' in hotel else 'N/A'
        print(f"  Address: {address_lines}, {city_name}")
        print(f"  Rating: {hotel.get('rating', 'N/A')}")
        print("-" * 50)

def hotel_list_search(destination):
    """Fetches hotels and formats the output."""
    try:
        # API call
        response = amadeus.reference_data.locations.hotels.by_city.get(cityCode=destination, radius=5, radiusUnit="KM", ratings="1, 2, 3, 4, 5")
        hotels = response.data

        if not hotels:
            print("No hotels found.")
            return

        # Extract and format the relevant details
        formatted_data = [
            {
                "name": hotel.get('name', 'N/A'),
                "address": hotel.get('address', {}),
                "rating": hotel.get('rating', 'N/A')
            }
            for hotel in hotels
        ]

        # Print the formatted hotel data
        format_hotel_data(formatted_data)
    except ResponseError as error:
        print(f"Error fetching hotel details: {error}")
        return None

def main():
    print("Welcome to the Vacation Planner!")
    
    # Fetch flight offers
    flight_offers_search()

    # Fetch hotel list offers
    destination = input("Please enter the destination city code for hotels: ")
    hotel_list_search(destination)

if __name__ == "__main__":
    main()