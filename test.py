import os
import certifi

os.environ['SSL_CERT_FILE'] = certifi.where()




from amadeus import Client, ResponseError, Location


# Initialize the Amadeus client
amadeus = Client(
    client_id='BAsFVPgNtKMM9E6v9DahzilctL9xB5Jc',
    client_secret='d6awkC2fGUjd1Rmw',
    ssl_verify=False  # Disable SSL verification
)

try:
    # Example API call: Fetching locations
    response = amadeus.reference_data.locations.get(
        keyword="New York",
        subType="CITY"
    )
    print(response.data)

except ResponseError as error:
    print(f"Error occurred: {error}")