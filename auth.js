const API_BASE = 'http://localhost:8000';
const ENDPOINTS = {
    register: `${API_BASE}/authentication/register/`,
    login: `${API_BASE}/authentication/login/`,
    logout: `${API_BASE}/authentication/logout/`,
    profile: `${API_BASE}/authentication/profile/`,
    checkAuth: `${API_BASE}/authentication/check-auth/`
};

function getToken() {
    return localStorage.getItem('access_token');
}

function setTokens(access, refresh) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
}

function clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

function isAuthenticated() {
    return !!getToken();
}

async function register() {
    const userData = {
        username: document.getElementById('username').value,
        first_name: document.getElementById('firstName').value || '',
        last_name: document.getElementById('lastName').value || '',
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        password_check: document.getElementById('passwordCheck').value
    };

    try {
        const response = await fetch(ENDPOINTS.register, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Реєстрація успішна! Тепер увійдіть.');
            window.location.href = 'login.html';
        } else {
            const error = Object.values(data).flat().join(', ');
            alert('Помилка: ' + error);
        }
    } catch (error) {
        alert('Помилка мережі');
    }
}

async function login(username, password) {
    try {
        const response = await fetch(ENDPOINTS.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            setTokens(data.access, data.refresh);
            
            const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
            window.location.href = returnUrl;
        } else {
            alert('Невірний логін або пароль');
        }
    } catch (error) {
        alert('Помилка мережі');
    }
}

function logout() {
    clearTokens();
    window.location.href = 'index.html';
}

function updateNav() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    if (isAuthenticated()) {
        navLinks.innerHTML = `
            <a href="index.html">Головна</a>
            <a href="dashboard.html">Кабінет</a>
            <a href="#" onclick="logout()">Вийти</a>
        `;
    } else {
        navLinks.innerHTML = `
            <a href="index.html">Головна</a>
            <a href="login.html">Вхід</a>
            <a href="register.html">Реєстрація</a>
        `;
    }
}

if (window.location.pathname.includes('login.html') || 
    window.location.pathname.includes('register.html')) {
    if (isAuthenticated()) {
        window.location.href = 'index.html';
    }
}

if (window.location.pathname.includes('dashboard.html')) {
    if (!isAuthenticated()) {
        window.location.href = `login.html?return=${encodeURIComponent('dashboard.html')}`;
    }
}
