const authDiv = document.getElementById('auth');
const userPanel = document.getElementById('userPanel');
const userPanelWrapper = document.getElementById('userPanelWrapper');
const userNameSpan = document.getElementById('userName');
const reviewList = document.getElementById('reviewList');

function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;
    const firstName = document.getElementById('regFirstName').value;
    // Email validation (basic pattern)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return; // Stop further processing if email is invalid
    }

    localStorage.setItem(`user_${email}`, JSON.stringify({ firstName, password, reviews: [] }));
    alert("Registered successfully!");

    document.getElementById('regFirstName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPass').value = '';
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;
    const userData = JSON.parse(localStorage.getItem(`user_${email}`));
    if (userData && userData.password === password) {
        localStorage.setItem("loggedIn", email);
        showUserPanel();
    } else {
        alert("Invalid login.");
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    location.reload();
}

function submitReview() {
    const product = document.getElementById('product').value;
    const review = document.getElementById('review').value;
    const rating = parseInt(document.getElementById('rating').value);
    const email = localStorage.getItem("loggedIn");
    const userData = JSON.parse(localStorage.getItem(`user_${email}`));

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    userData.reviews.push({ product, review, rating });
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));
    displayReviews(userData.reviews);
}

function showUserPanel() {
    const email = localStorage.getItem("loggedIn");
    if (!email) return;

    const userData = JSON.parse(localStorage.getItem(`user_${email}`));

    // Fade out auth and login sections
    const auth = document.getElementById('auth');
    const login = document.getElementById('login');
    auth.classList.add('fade-out');
    login.classList.add('fade-out');

    // After fade-out, hide completely
    setTimeout(() => {
        auth.classList.add('hidden');
        login.classList.add('hidden');
    }, 500);

    // Show user panel
    userPanelWrapper.classList.remove('hidden');
    userPanel.classList.remove('hidden');
    userNameSpan.textContent = userData.firstName;
    displayReviews(userData.reviews);
}

function displayReviews(reviews) {
    reviewList.innerHTML = '';
    for (const r of reviews) {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const li = document.createElement('li');
        li.innerHTML = `<strong>${r.product}</strong>: ${r.review}<br>
        <span class='stars'>${stars}</span><br>
        <small>Reviewed on ${r.date}</small>`;
        reviewList.appendChild(li);
    }
}

if (localStorage.getItem("loggedIn")) {
    showUserPanel();
}
