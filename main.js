const header =  document.querySelector("header");

window.addEventListener("scroll", function(){
    header.classList.toggle("sticky", window.scrollY > 80);
});

let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navlist.classList.toggle('open');
}
window.onscroll = () => {
    menu.classList.remove('bx-x');
    navlist.classList.remove('open');
}

const sr = ScrollReveal({
    origin: 'top',
    distance: '80px', 
    duration: 1000,    
    delay: 200,        
    reset: true
});
sr.reveal('.home-text', { delay: 100 });
sr.reveal('.home-img', { delay: 100 });
sr.reveal('.container', { delay: 100 });
sr.reveal('.about-img', {});
sr.reveal('.about-text', { delay: 100 });
sr.reveal('.middle-text', {});
sr.reveal('.row-btn, .shop-content', { delay: 100 });
sr.reveal('.review-content', { delay: 100 });

let cartIcon = document.querySelector('.bx-cart'); 
let cartSidebar = document.querySelector('#cart-sidebar');
let closeCart = document.querySelector('#close-cart');

if(cartIcon) {
    cartIcon.parentElement.onclick = (e) => {
        e.preventDefault();
        cartSidebar.classList.add('open');
    }
}

if(closeCart) {
    closeCart.onclick = () => {
        cartSidebar.classList.remove('open');
    }
}

let cartItems = [];
const cartContent = document.querySelector('#cart-content');
const totalPriceElement = document.querySelector('.total span');
const addCartBtns = document.querySelectorAll('.add-cart');

addCartBtns.forEach(btn => {
    btn.onclick = (e) => {
        e.preventDefault();
        
        const productRow = btn.parentElement.parentElement.parentElement;
        const title = productRow.querySelector('.product-title').innerText;
        const price = productRow.querySelector('.product-price').innerText;
        const imgSrc = productRow.querySelector('img').src;

        addItemToCart(title, price, imgSrc);
        
        document.querySelector('#cart-sidebar').classList.add('open');
    }
});

function addItemToCart(title, price, imgSrc) {
    const existingItem = cartItems.find(item => item.title === title);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ title, price, imgSrc, quantity: 1 });
    }
    
    updateCartUI();
}

function updateCartUI() {
    cartContent.innerHTML = ''; 
    let total = 0;

    if (cartItems.length === 0) {
        cartContent.innerHTML = '<p class="empty-msg">Your cart is empty</p>';
        totalPriceElement.innerText = '$0.00';
        return;
    }

    cartItems.forEach((item, index) => {
        const priceNum = parseFloat(item.price.replace('$', ''));
        total += priceNum * item.quantity;

        const cartBox = document.createElement('div');
        cartBox.classList.add('cart-box'); 
        cartBox.innerHTML = `
            <img src="${item.imgSrc}" style="width: 50px; border-radius: 10px;">
            <div class="detail-box" style="flex: 1; margin-left: 10px;">
                <div class="cart-product-title" style="font-size: 14px; font-weight: 600;">${item.title}</div>
                <div class="cart-price" style="color: var(--main-color);">${item.price}</div>
                <small>Qty: ${item.quantity}</small>
            </div>
            <i class='bx bxs-trash-alt remove-item' data-index="${index}" style="cursor: pointer; color: #ff3333;"></i>
        `;
        cartContent.appendChild(cartBox);
    });

    totalPriceElement.innerText = `$${total.toFixed(2)}`;

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = () => {
            const idx = btn.getAttribute('data-index');
            cartItems.splice(idx, 1);
            updateCartUI();
        };
    });
}

const searchIcon = document.querySelector('.bx-search');
const searchOverlay = document.querySelector('#search-overlay');
const closeSearch = document.querySelector('#close-search');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');

const menuData = [
    { name: "Home", link: "#home" },
    { name: "About Us", link: "#about" },
    { name: "Our Shop", link: "#shop" },
    { name: "Our Customer", link: "#review" },
    { name: "Contact Us", link: "#contact" }
];

searchIcon.parentElement.onclick = (e) => {
    e.preventDefault();
    searchOverlay.classList.add('active');
    searchInput.focus();
}

closeSearch.onclick = () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
}

searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';

    if (query.length > 0) {
        const filteredMenu = menuData.filter(item => 
            item.name.toLowerCase().includes(query)
        );

        filteredMenu.forEach(item => {
            const a = document.createElement('a');
            a.href = item.link;
            a.classList.add('result-item');
            a.innerText = item.name;
            
            a.onclick = () => searchOverlay.classList.remove('active');
            
            searchResults.appendChild(a);
        });
    }
}

const userIcon = document.querySelector('#user-icon');
const authOverlay = document.querySelector('#auth-overlay');
const closeAuth = document.querySelector('#close-auth');
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const goToRegister = document.querySelector('#go-to-register');
const goToLogin = document.querySelector('#go-to-login');

userIcon.onclick = (e) => {
    e.preventDefault();
    authOverlay.classList.add('active');
};

closeAuth.onclick = () => authOverlay.classList.remove('active');

goToRegister.onclick = () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
};

goToLogin.onclick = () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
};

const regNameInput = document.querySelector('#register-form input[type="text"]');
const regEmailInput = document.querySelector('#register-form input[type="email"]');
const regPassInput = document.querySelector('#register-form input[type="password"]');
const regBtn = document.querySelector('#register-submit');

if(regBtn) {
    regBtn.onclick = () => {
        const name = regNameInput.value;
        const email = regEmailInput.value;
        const pass = regPassInput.value;

        if (name === "" || email === "" || pass === "") {
            alert("Please fill in all fields!");
            return;
        }

        const userData = {
            userName: name,
            userEmail: email
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));

        alert(`Registration Successful! Welcome, ${name}`);
        
        authOverlay.classList.remove('active');
        checkLoginStatus();
    };
}

function checkLoginStatus() {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    const userIcon = document.querySelector('#user-icon');

    if (savedUser && savedUser.userName) {
        userIcon.innerHTML = `<span id="user-display">${savedUser.userName}</span>`;
        
        userIcon.style.background = "transparent"; 
        userIcon.style.padding = "0 5px";
        userIcon.style.display = "flex";
        userIcon.style.alignItems = "center";
        
        userIcon.onclick = (e) => {
            e.preventDefault();
            if(confirm("Do you want to logout?")) {
                logout();
            }
        };
    } else {
        userIcon.innerHTML = `<i class='bx bx-user'></i>`;
        userIcon.style.background = "transparent";
    }
}
window.onload = () => {
    checkLoginStatus();
};

const loginEmailInput = document.querySelector('#login-form input[type="email"]');
const loginPassInput = document.querySelector('#login-form input[type="password"]');
const loginBtn = document.querySelector('#login-submit');

if(loginBtn) {
    loginBtn.onclick = (e) => {
        e.preventDefault();
        
        const email = loginEmailInput.value;
        const pass = loginPassInput.value;
        const savedUser = JSON.parse(localStorage.getItem('currentUser'));

        if (savedUser && savedUser.userEmail === email) {
            alert(`Welcome back, ${savedUser.userName}!`);
            authOverlay.classList.remove('active');
            checkLoginStatus(); // Update UI header
        } else {
            alert("Email not found! Please register first.");
        }
    };
}

function logout() {
    localStorage.removeItem('currentUser');
    location.reload(); 
}