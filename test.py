from amadeus import Client, ResponseError
import json
from amadeus import Client, ResponseError
import os
import certifi

os.environ['SSL_CERT_FILE'] = certifi.where()

amadeus = Client(
    client_id="BAsFVPgNtKMM9E6v9DahzilctL9xB5Jc",
    client_secret="d6awkC2fGUjd1Rmw"
)

print()

try:
    response = amadeus.shopping.flight_offers_search.get(
        originLocationCode='MAD',
        destinationLocationCode='ATH',
        departureDate='2025-11-01',
        adults = 1,
        children = 2)
    result = response.result

    file_path = 'flight_offers_response.json'
    with open(file_path, 'w') as json_file:
        json.dump(result, json_file, indent=4)  # indent=4 for better readability
    
    print(f"Response saved to {file_path}")

except ResponseError as error:
    print(error)

