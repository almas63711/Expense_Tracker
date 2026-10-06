// auth.js
// Simple client-side authentication using localStorage.
// Note: this is for a front-end-only prototype (no backend/server).
// Passwords are stored in localStorage, so this is NOT secure for a real
// production app — fine for a college project demo.

const USERS_KEY = 'expenseTrackerUsers';
const SESSION_KEY = 'expenseTrackerCurrentUser';

// Get all registered users from localStorage
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Save the users array back to localStorage
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Register a new user
function registerUser(name, email, password) {
    const users = getUsers();

    const existing = users.find(u => u.email === email);
    if (existing) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password // plain text for demo purposes only
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, message: 'Account created successfully.' };
}

// Log in an existing user
function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return { success: false, message: 'Invalid email or password.' };
    }

    // Store only non-sensitive info in the session
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email }));

    return { success: true, message: 'Login successful.' };
}

// Get the currently logged-in user (or null)
function getCurrentUser() {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
}

// Log out the current user
function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}