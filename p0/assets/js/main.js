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


    $(document).ready(function () {
        // Disable automatic sliding
        $('#paragraphCarousel').carousel({
            interval: false, // Disable auto-slide
            ride: false,     // Ensure no auto slide on load
            pause: true,     // Pause when hovering
            wrap: true       // Enable cycling between slides
        });


    
        $(document).ready(function () {
            $('#paragraphCarousel').carousel({
                interval: false, // Disable auto-slide
                ride: false,     // Ensure no auto-slide on load
                pause: true,     // Pause on hover
                wrap: true       // Enable cycling between slides
            });
        
            // Handle the fade-out and fade-in when navigating between slides
            $('#paragraphCarousel').on('slide.bs.carousel', function (e) {
                var $activeSlide = $(e.target).find('.carousel-item.active');
                var $nextSlide = $(e.relatedTarget);
            
                // Smooth transition between slides
                $activeSlide.stop().animate({ 'opacity': 0 }, 800, function () {
                    $activeSlide.removeClass('active').css({ 'display': 'none', 'opacity': 1 });
                });
            
                $nextSlide.stop().css({ 'display': 'flex', 'opacity': 0 }).addClass('active').animate({ 'opacity': 1 }, 800);
            });
        });
    });

    
})(jQuery);

