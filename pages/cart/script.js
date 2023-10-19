let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.getElementById('icon-cart');
let iconCartSpan = document.querySelector('#icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

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
    notificationBox.style.top = `${notificationTop}px`;
    notificationBox.style.right = `${notificationRight}px`;

    // Toggle the active class to show/hide the notification box
    notificationBox.classList.toggle('active');
});


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    // Remove default data from HTML
    listProductHTML.innerHTML = '';

    // Add new data
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

const addToCart = (product_id) => {
    const existingProduct = cart.find(item => item.product_id === product_id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ product_id, quantity: 1 });
    }
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id === item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus">&lt;</span>
                    <span>${item.quantity}</span>
                    <span class="plus">&gt;</span>
                </div>
            `;
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

const changeQuantityCart = (product_id, type) => {
    const productIndex = cart.findIndex(item => item.product_id === product_id);
    if (productIndex >= 0) {
        if (type === 'plus') {
            cart[productIndex].quantity++;
        } else {
            cart[productIndex].quantity--;
            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }
        }
    }
    addCartToHTML();
    addCartToMemory();
};
const initApp = () => {
    // Get product data
    fetch('games.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            // Get cart data from local storage
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

initApp();
