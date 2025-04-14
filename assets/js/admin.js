document.addEventListener("DOMContentLoaded", function () {
    const headerLinks = document.querySelector(".header");
    const scheduleButtons = document.querySelectorAll(".btn-a");
    const currentUserJSON = localStorage.getItem("currentUser");
    const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;

    if (!headerLinks) return;

    const loginItem = headerLinks.querySelector('li a[href="/pages/auth/login.html"]');
    const manageScheduleItem = headerLinks.querySelector('li a[href="/pages/admin/adminDashboard.html"]');

    if (currentUser) {
        if (loginItem) {
            loginItem.parentElement.remove();
        }

        if (currentUser.role !== "admin" && manageScheduleItem) {
            manageScheduleItem.parentElement.remove();
        }

        const userItem = document.createElement("li");
        const userLabel = currentUser.fullname || "USER";

        userItem.innerHTML = `
            <span class="user-info">
                <strong>${userLabel}</strong> 
                <a href="#" id="logoutBtn" class="logout-link">Đăng xuất</a>
            </span>
        `;
        headerLinks.appendChild(userItem);

        document.getElementById("logoutBtn").addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "/pages/auth/register.html"; 
        });

        scheduleButtons.forEach(btn => {
            if (currentUser.role === "admin") {
                btn.textContent = "Quản lý lịch";
                btn.setAttribute("href", "/pages/admin/adminDashboard.html");
            } else {
                btn.textContent = "Đặt lịch";
                btn.setAttribute("href", "/pages/booking/schedule.html");
            }
        });

    } else {
        scheduleButtons.forEach(btn => {
            btn.textContent = "Đăng nhập để đặt lịch";
            btn.setAttribute("href", "/pages/auth/login.html");
        });
    }
});
