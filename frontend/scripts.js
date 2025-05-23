document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit-btn").addEventListener("click", function () {
        const startingLocation = document.getElementById("from-destination").value;
        const travelDate = document.getElementById("date").value;
        const budget = document.getElementById("budget").value;
        const destinationPreference = document.getElementById("destination-preference").value;

        const userInput = `Starting Location: ${startingLocation}\nTravel Date: ${travelDate}\nBudget: $${budget}\nDestination Preference: ${destinationPreference}\n`;

        fetch("http://127.0.0.1:5000/save-input", {  // Ensure full URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: userInput }),
        })
        .then(response => response.text())
        .then(data => {
            console.log("Success:", data);
            alert("Your input has been saved to input.txt!");
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});
