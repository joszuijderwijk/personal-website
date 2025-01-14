
document.addEventListener("DOMContentLoaded", function () {
    // Function to update icon based on status
    function updateIconColor(iconId, status) {
      const icon = document.getElementById(iconId);
      if (!icon) return;
  
      if (icon.tagName === "SPAN") {
        // Update class for <span> elements
        icon.className = status === 1 ? "icon-success" : "icon-failure";
      } else if (icon.tagName === "svg") {
        // Update fill color for SVG
        const circle = icon.querySelector("circle");
        if (circle) {
          circle.setAttribute("fill", status === 1 ? "green" : "red");
        }
      }
    }
  
    // Perform a GET request
    fetch("https://iot.joszuijderwijk.nl/devices-state")
      .then((response) => response.json())
      .then((data) => {
        // Update icons based on response
        updateIconColor("coffee-machine-icon", data.coffee_machine);
        updateIconColor("barrybox-icon", data.barrybox);
      })
      .catch((error) => {
        console.error("Error fetching status:", error);
        // Handle errors by setting default state
        updateIconColor("coffee-machine-icon", 0);
        updateIconColor("barrybox-icon", 0);
      });
  });
  