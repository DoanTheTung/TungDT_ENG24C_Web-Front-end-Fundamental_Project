document.addEventListener("DOMContentLoaded", function () {
    // Lấy phần tử header chứa các liên kết menu
    const headerLinks = document.querySelector(".header");

    // Lấy tất cả các nút có class ".btn-a"
    const scheduleButtons = document.querySelectorAll(".btn-a");

    // Lấy thông tin người dùng hiện tại từ localStorage
    const currentUserJSON = localStorage.getItem("currentUser");
    const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;

    // Nếu không có header, dừng luôn
    if (!headerLinks) return;

    // Tìm hai liên kết cần xử lý trong menu
    const loginItem = headerLinks.querySelector('li a[href="/pages/auth/login.html"]');
    const manageScheduleItem = headerLinks.querySelector('li a[href="/pages/admin/adminDashboard.html"]');

    // Nếu đã đăng nhập
    if (currentUser) {
        // Ẩn nút đăng nhập nếu đang đăng nhập
        if (loginItem) {
            loginItem.parentElement.remove();
        }

        // Nếu KHÔNG phải admin → ẩn link "Quản lý lịch"
        if (currentUser.role !== "admin" && manageScheduleItem) {
            manageScheduleItem.parentElement.remove();
        }

        // Tạo nút hiển thị thông tin người dùng + logout
        const userItem = document.createElement("li");
        const userLabel = currentUser.fullname || "USER"; // fallback nếu không có tên

        userItem.innerHTML = `
            <span class="user-info">
                <strong>${userLabel}</strong> 
                <a href="#" id="logoutBtn" class="logout-link">Đăng xuất</a>
            </span>
        `;
        headerLinks.appendChild(userItem); // Thêm vào menu

        // Bắt sự kiện logout → xóa currentUser khỏi localStorage và chuyển về trang đăng ký
        document.getElementById("logoutBtn").addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "/pages/auth/register.html"; 
        });

        // Cập nhật nội dung và đường dẫn của nút "Đặt lịch" tùy theo vai trò
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
        // Nếu chưa đăng nhập, tất cả các nút chuyển hướng đến trang đăng nhập
        scheduleButtons.forEach(btn => {
            btn.textContent = "Đăng nhập để đặt lịch";
            btn.setAttribute("href", "/pages/auth/login.html");
        });
    }
});
