document.addEventListener("DOMContentLoaded", function() {
    function toggleMessage() {
      const messageElement = document.getElementById("message");
  
      // Toggle between showing and hiding the message
      if (messageElement.style.display === "none" || messageElement.style.display === "") {
        messageElement.style.display = "block";
      } else {
        messageElement.style.display = "none";
      }
    }
  
    // Attach the toggle function to the button's click event
    document.querySelector("button").addEventListener("click", toggleMessage);
  });