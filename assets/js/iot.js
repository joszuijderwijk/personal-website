
document.addEventListener("DOMContentLoaded", function () {

    const statusMessages = {
      "coffee-machine": {
        online: "Currently making coffee",
        offline: "Currently not making coffee"
      },
      barrybox: {
        online: "Barrybox is online",
        offline: "Barrybox is offline"
      }
    };

    // Function to update icon based on status
    function updateIcon(iconId, status) {

      const icon = document.getElementById(iconId);
      if (!icon) return;
      if (icon.tagName === "IMG") {
        icon.className = status === 1 ? "device-enabled" : "device-disabled";
        icon.setAttribute("data-original-title", status === 1 ? statusMessages[iconId].online : statusMessages[iconId].offline);
      }
    }
  
    // Perform a GET request
    fetch("https://iot.joszuijderwijk.nl/devices-state")
      .then((response) => response.json())
      .then((data) => {
        // Update icons based on response
        updateIcon("coffee-machine", data.coffee_machine);
        updateIcon("barrybox", data.barrybox);
      })
      .catch((error) => {
        console.error("Error fetching status:", error);
        // Handle errors by setting default state
        updateIcon("coffee-machine", 0);
        updateIcon("barrybox", 0);
      });
  });
  