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
        showNotification('Invalid user', '--primary-red')
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
        showNotification('Invalid user!', '--primary-red')
        return
    }

    if (currUser.password !== currPassword) {
        showNotification('Wrong Password! Please try again.', '--primary-red')
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

    showNotification('Password change success. Please login again.', '--tosca');
    logout(true);
}

function showNotification(text, color) {
  if (!text) return;

  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: var(${color});
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    animation: slideInRight 0.3s ease;
    font-weight: bold;
  `;
  notification.textContent = text;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

const user = checkLocalStorage('vintixCurrentUser');

if (!user) {
    window.location.href = './login.html';
}

document.getElementById('firstName').textContent = user.firstName;
document.getElementById('lastName').textContent = user.lastName;
document.getElementById('email').textContent = user.email;