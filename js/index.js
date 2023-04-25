const cart = [];

function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*\d).{4,}$/.test(password);
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.querySelector('#register-name').value;
    const birthdate = document.querySelector('#register-birthdate').value;
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;

    if (!validatePassword(password)) {
        Toastify({
            text: "La contraseña debe tener al menos: 6 caracteres, 1 Mayúscula y 1 Número.",
            duration: 5000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: "linear-gradient(to right, #020024, #00d4ff)",
                borderRadius: ".5rem",
                fontSize: "18px",
                width: "400px",
                textAlign: "center"
            },
            offset: {
                x: '1.5rem', 
                y: '1.5rem' 
            },
            onClick: function(){} 
        }).showToast(); 
        return;
    }

    const user = { name, birthdate, email, password };
    localStorage.setItem('user', JSON.stringify(user));
    showToast('Registro exitoso');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
        Toastify({
            text: "Correo electrónico o Contraseña incorrectos.",
            duration: 5000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: "linear-gradient(to right, #020024, #00d4ff)",
                borderRadius: ".5rem",
                fontSize: "18px",
                width: "400px",
                textAlign: "center"
            },
            offset: {
                x: '1.5rem', 
                y: '1.5rem' 
            },
            onClick: function(){} 
        }).showToast(); 
        showToast('Correo electrónico o contraseña incorrectos');
        return;
    }

    window.location.href = 'homepage.html';
}

function loadProducts() {
    return fetch('../data/products.json') // Ruta al archivo JSON
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        return response.json();
      })
      .then(products => {
        renderProducts(products);  // Renderizar los productos cargados

      })
      .catch(error => {
        console.error('Error al cargar los productos:', error);
      });
  }
  
function addToCart(product) {
    Toastify({
        text: "Producto Agregado al Carrito.",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "linear-gradient(to right, #020024, #00d4ff)",
            borderRadius: ".5rem",
            fontSize: "18px",
            width: "400px",
            textAlign: "center"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
        },
        onClick: function(){} 
    }).showToast(); 

    const productIndex = cart.findIndex(item => item.id === product.id);

    if (productIndex !== -1) {    
        cart[productIndex].quantity += 1;  // Aumentar en 1 la cantidad del mismo producto
    } else {
    product.quantity = 1; 
    cart.push(product);
     }
    renderCart();
    }

function removeFromCart(productId) {

    Toastify({
        text: "Producto Eliminado del Carrito.",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "linear-gradient(to right, #020024, #00d4ff)",
            borderRadius: ".5rem",
            fontSize: "18px",
            width: "400px"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
        },
        onClick: function(){} 
    }).showToast(); 

    const index = cart.findIndex(product => product.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    renderCart();
}

function renderCart() {
    const cartList = document.querySelector('#cart-list');
    cartList.innerHTML = '';

    cart.forEach(product => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        // Mostrar la cantidad del producto en el carrito
        listItem.innerHTML = `${product.title} - $${product.price} (Cantidad: ${product.quantity}) <button class="btn btn-outline-dark btn-block rounded-pill btn-200" onclick="removeFromCart(${product.id})">Eliminar</button>`;
        cartList.appendChild(listItem);
      });
}

function emptyCart() {
    cart.length = 0;

    renderCart();
    Toastify({
        text: "El carrito ha sido vaciado.",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "linear-gradient(to right, #020024, #00d4ff)",
            borderRadius: ".5rem",
            fontSize: "18px",
            width: "400px"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
        },
        onClick: function(){} 
    }).showToast(); 
}

function checkout() {
    let total = 0;
    let details = '';

    cart.forEach(product => {
        const productTotal = product.price * product.quantity;
        total += productTotal;
        details += `<p>Nombre: ${product.title}<br>Cantidad: ${product.quantity}<br>Precio: $${product.price}<br>Subtotal: $${productTotal}</p>`;
    });

    const message = `<h3>Detalle de tu compra:</h3>${details}<h3>Total de tu compra: $${total}</h3>`;

    const checkoutDetailsElement = document.querySelector('#checkout-details');
    checkoutDetailsElement.innerHTML = message;
}

function renderProducts(products) {
    const productsContainer = document.querySelector('#products-container');
    productsContainer.innerHTML = '';

    if (Array.isArray(products)) { // Verificar si "products" es array
        products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-4';
        productCard.innerHTML = `<div class="card"> <img class="card-img-top" src="${product.image}" alt="${product.title}"> <div class="card-body"> <h5 class="card-title">${product.title}</h5> <p class="card-text">${product.description}</p> <p class="card-text"><b>Precio</b>: $${product.price}</p> <button class="btn btn-outline-dark btn-block rounded-pill btn-200" onclick="addToCart(${JSON.stringify(product).split('"').join('&quot;')})">Añadir al carrito</button> </div> </div>`;
        productsContainer.appendChild(productCard);
        });
    }
  }

const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
if (registerForm && loginForm) {
registerForm.addEventListener('submit', handleRegister);
loginForm.addEventListener('submit', handleLogin);
}

const checkoutButton = document.querySelector('#checkout-button');
if (checkoutButton) {
checkoutButton.addEventListener('click', checkout);
}

const emptyCartButton = document.querySelector('#empty-button');
if (emptyCartButton) {
    emptyCartButton.addEventListener('click', emptyCart);
}

if (window.location.pathname.endsWith('pages/homepage.html')) {
    loadProducts();
    renderProducts();
}