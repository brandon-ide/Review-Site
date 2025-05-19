const authDiv = document.getElementById('auth');
const userPanel = document.getElementById('userPanel');
const userPanelWrapper = document.getElementById('userPanelWrapper');
const userNameSpan = document.getElementById('userName');
const reviewList = document.getElementById('reviewList');

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent form submission reload

      const firstName = document.getElementById('regFirstName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPass').value;

      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      fetch('register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ firstName, email, password })
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert('Registration successful! You can now log in.');
          registerForm.reset();
        } else {
          alert('Registration failed: ' + (result.message || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error('Error during registration:', err);
        alert('An error occurred during registration.');
      });
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPass').value;

      fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, password })
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          showUserPanel(result.firstName);
        } else {
          alert("Invalid login.");
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        alert('An error occurred.');
      });
    });
  }

  fetch('check_session.php')
  .then(res => res.json())
  .then(result => {
    if (result.loggedIn) {
      showUserPanel(result.firstName);
    }
  });
});

async function logout() {
    await fetch('logout.php');
    location.reload();
}

async function submitReview() {
    const productInput = document.getElementById('product');
    const reviewInput = document.getElementById('review');
    const ratingInput = document.getElementById('rating');

    const product = productInput.value;
    const review = reviewInput.value;
    const rating = parseInt(ratingInput.value);
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!product || !review || isNaN(rating)) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    const response = await fetch('review.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            review_header: product,
            review_body: review,
            review_date: date,
            stars: rating
        })
    });

    const result = await response.json();
    if (result.success) {
        alert("Review submitted successfully!");
        loadReviews();
        productInput.value = '';
        reviewInput.value = '';
        ratingInput.value = '1';
    } else {
        alert("Error: " + result.message);
    }
}

function showUserPanel(firstName) {
    authDiv.classList.add('fade-out');
    document.getElementById('login').classList.add('fade-out');

    setTimeout(() => {
        authDiv.classList.add('hidden');
        document.getElementById('login').classList.add('hidden');
    }, 500);

    userPanelWrapper.classList.remove('hidden');
    userPanel.classList.remove('hidden');
    userNameSpan.textContent = firstName;

    loadReviews();
}

async function loadReviews() {
    const response = await fetch('get_reviews.php');
    const reviews = await response.json();
    displayReviews(reviews);
}

function displayReviews(reviews) {
    reviewList.innerHTML = '';
    for (const r of reviews) {
        const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
        const li = document.createElement('li');
        li.innerHTML = `<strong>${r.review_header}</strong>: ${r.review_body}<br>
        <span class='stars'>${stars}</span><br>
        <small>Reviewed on ${r.review_date}</small>`;
        reviewList.appendChild(li);
    }
}
