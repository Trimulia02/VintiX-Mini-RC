function checkLocalStorage(item) {
    try {
        const data = localStorage.getItem(item);
        if (data) {
            return JSON.parse(data)
        } else {
            return false
        }
    } catch (e) {
        console.error("Auth error:", e);
    }
}

function logout(skipPrompt) {
    let user = checkLocalStorage('vintixCurrentUser');
    if (!user) {
        alert('Invalid user')
        return
    }
    const ok = skipPrompt ? true : confirm(`Log out from ${user.firstName}'s account?`);
    if (ok) {
        localStorage.removeItem("vintixCurrentUser");
        window.location.href = './login.html';
    }
}

function changePassword() {
    const currPassword = document.getElementById("currPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    const currUser = checkLocalStorage('vintixCurrentUser');
    const userData = checkLocalStorage('vintixUsers');
    if (!currUser || !userData) {
        alert('Invalid user')
        return
    }

    if (currUser.password !== currPassword) {
        alert('Wrong Password!')
        return
    }

    currUser.password = newPassword;
    for (let user of userData) {
        if (currUser.email === user.email) {
            user.password = newPassword;
        }
    }

    localStorage.setItem('vintixCurrentUser', JSON.stringify(currUser));
    localStorage.setItem('vintixUsers', JSON.stringify(userData));

    alert('Password change success. Please login again.');
    logout(true);
}

const user = checkLocalStorage('vintixCurrentUser');

if (!user) {
    window.location.href = './login.html';
}

document.getElementById('firstName').textContent = user.firstName;
document.getElementById('lastName').textContent = user.lastName;
document.getElementById('email').textContent = user.email;