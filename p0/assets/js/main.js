(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });


    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // CAROUSEL PARAGRAPH 

    document.addEventListener('DOMContentLoaded', function () {
        const carouselItems = document.querySelectorAll('#paragraphCarousel .carousel-item');
        let currentSlide = 0; // Track the current slide
        let transitioning = false; // Prevent multiple transitions at once
    
        // Hide all slides
        function hideAllSlides() {
            carouselItems.forEach(item => {
                item.style.display = 'none'; // Hide the item
                item.style.opacity = '0'; // Ensure it's invisible
            });
        }
    
        // Show the current slide
        function showSlide(index) {
            if (transitioning) return; // Prevent overlapping transitions
            transitioning = true; // Set transitioning flag to true
    
            // Hide the current slide
            carouselItems[currentSlide].style.transition = 'opacity 0.8s ease-in-out';
            carouselItems[currentSlide].style.opacity = '0'; // Fade out
    
            setTimeout(() => {
                carouselItems[currentSlide].classList.remove('active');
                carouselItems[currentSlide].style.display = 'none'; // Fully hide after fade-out
    
                // Update current slide index
                currentSlide = index;
    
                // Show the next slide
                carouselItems[currentSlide].style.display = 'flex'; // Make visible
                setTimeout(() => {
                    carouselItems[currentSlide].classList.add('active');
                    carouselItems[currentSlide].style.opacity = '1'; // Fade in
                    transitioning = false; // Reset transitioning flag
                }, 50); // Small delay to ensure visibility before fade-in
            }, 800); // Wait for fade-out (800ms) to complete
        }
    
        // Event listener for the next button
        document.querySelector('#nextBtn').addEventListener('click', function () {
            const nextSlide = (currentSlide + 1) % carouselItems.length;
            showSlide(nextSlide);
        });
    
        // Event listener for the prev button
        document.querySelector('#prevBtn').addEventListener('click', function () {
            const prevSlide = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
            showSlide(prevSlide);
        });
    
        // Initialize the first slide to be visible
        hideAllSlides(); // Hide all slides initially
        carouselItems[currentSlide].style.display = 'flex'; // Show the first slide
        carouselItems[currentSlide].style.opacity = '1'; // Ensure it's fully visible
    });

    //END

    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 5,
        time: 2000
    });


   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // CUSTOM CAROUSEL 

    document.addEventListener('DOMContentLoaded', function() {
        let currentCustomSlide = 0;
        const customImages = document.querySelectorAll('.custom-carousel-images img');
        const customText = document.getElementById('custom-carousel-text');
        const customImageTexts = [
            "Queen Marika was of the Numen race, a born Empyrean, for she was chosen by the Greater Will to rule the Lands Between. ",
            "With the lost of her golden son, faith in the golden order was questioned, and thus Queen Marika shattered the Elden Ring ",
            "As punishment for disobeying the Greater Will, Queen Marika was imprisoned in the Erdtree, never to be seen again."
        ];
    
        // Initialize the carousel by showing the first image and text
        customImages[currentCustomSlide].classList.add('active');
        customText.innerText = customImageTexts[currentCustomSlide];
    
        // Function to update the carousel slide and text
        function updateCustomSlide() {
            // Hide all images
            customImages.forEach(img => img.classList.remove('active'));
            // Show the current image
            customImages[currentCustomSlide].classList.add('active');
            // Update the text
            customText.innerText = customImageTexts[currentCustomSlide];
        }
    
        // Next slide function
        function nextCustomSlide() {
            currentCustomSlide = (currentCustomSlide + 1) % customImages.length;
            updateCustomSlide();
        }
    
        // Previous slide function
        function prevCustomSlide() {
            currentCustomSlide = (currentCustomSlide - 1 + customImages.length) % customImages.length;
            updateCustomSlide();
        }
    
        // Add event listeners to buttons
        document.querySelector('.custom-next').addEventListener('click', nextCustomSlide);
        document.querySelector('.custom-prev').addEventListener('click', prevCustomSlide);
    
        // Apply initial slide settings
        updateCustomSlide();
    });



    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Create a new FormData object
        const formData = new FormData(form);

        // Send the form data via AJAX
        fetch("contact.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Show success or error message
        })
        .catch(error => {
            alert("Error: " + error);
        });
    });
})(jQuery);

