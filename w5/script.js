document.addEventListener("DOMContentLoaded", function() {
    function showMessage() {
      document.getElementById("message").style.display = "block";
    }
    
    // Attach the function to the button's click event
    document.querySelector("button").addEventListener("click", showMessage);
  });