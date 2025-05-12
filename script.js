const authDiv = document.getElementById('auth');
const loginDiv = document.getElementById('login');
const userPanel = document.getElementById('userPanel');
const userNameSpan = document.getElementById('userName');
const reviewList = document.getElementById('reviewList');

function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;
    const firstName = document.getElementById('regFirstName').value;
    localStorage.setItem(`user_${email}`, JSON.stringify({ firstName, password, reviews: [] }));
    alert("Registered successfully!");
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
    userData.reviews.push({ product, review, rating });
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));
    displayReviews(userData.reviews);
}

function showUserPanel() {
    const email = localStorage.getItem("loggedIn");
    if (!email) return;
    authDiv.classList.add('hidden');
    loginDiv.classList.add('hidden');
    userPanel.classList.remove('hidden');
    const userData = JSON.parse(localStorage.getItem(`user_${email}`));
    userNameSpan.textContent = userData.firstName;
    displayReviews(userData.reviews);
}

function displayReviews(reviews) {
    reviewList.innerHTML = '';
    for (const r of reviews) {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const li = document.createElement('li');
        li.innerHTML = `<strong>${r.product}</strong>: ${r.review}<br><span class='stars'>${stars}</span>`;
        reviewList.appendChild(li);
    }
}

if (localStorage.getItem("loggedIn")) {
    showUserPanel();
}
