let menu = document.querySelector('.menu-icon');
let navbar = document.querySelector('.menu');

menu.onclick = () => {
    navbar.classList.toggle('active')
    menu.classList.toggle('move')
    notificationBox.classList.remove('active')
}

// Get the notification button and box
let bellIcon = document.querySelector('#bell-icon');
let notificationBox = document.querySelector('.notification');

// Define the additional distance (in pixels) between the button and the box
const distanceFromButton = 10; // Adjust this value as needed

// Add a click event listener to the notification button
bellIcon.addEventListener('click', () => {
    // Get the position and dimensions of the notification button
    let buttonRect = bellIcon.getBoundingClientRect();
    let buttonTop = buttonRect.bottom;
    let buttonRight = window.innerWidth - buttonRect.right;

    // Calculate the notification box position with additional distance
    let notificationTop = buttonTop + distanceFromButton;
    let notificationRight = buttonRight + distanceFromButton;

    // Set the notification box's position
    notificationBox.style.top = notificationTop + 'px';
    notificationBox.style.right = notificationRight + 'px';

    // Toggle the active class to show/hide the notification box
    notificationBox.classList.toggle('active');
});

var swiper = new Swiper(".trending-content", {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
    },
  });


