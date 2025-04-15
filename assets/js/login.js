document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    // Tạo tài khoản admin mặc định
    const adminEmail = "doanthetung126@gmail.com";
    if (!localStorage.getItem(adminEmail)) {
        const admin = {
            fullname: "Đoàn Thế Tùng",
            email: adminEmail,
            password: "tung1234",
            role: "admin"
        };
        localStorage.setItem(adminEmail, JSON.stringify(admin));
    }

    // Nếu có form đăng nhập
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // Lấy input và vùng hiển thị lỗi
            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");
            const loginError = document.getElementById("loginError");

            if (loginError) loginError.textContent = "";

            // Kiểm tra thiếu input
            if (!emailInput || !passwordInput) {
                loginError.textContent = "Thiếu trường thông tin đăng nhập.";
                return;
            }

            // Lấy dữ liệu người dùng nhập
            const email = emailInput.value.trim().toLowerCase();
            const password = passwordInput.value.trim();

            // Kiểm tra dữ liệu rỗng
            if (!email) {
                loginError.textContent = "Email không được để trống";
                return;
            }

            if (!password) {
                loginError.textContent = "Mật khẩu không được để trống";
                return;
            }

            // Kiểm tra tài khoản có tồn tại không
            const storedUserJSON = localStorage.getItem(email);
            if (!storedUserJSON) {
                loginError.textContent = "Email chưa được đăng ký!";
                return;
            }

            // Parse dữ liệu người dùng
            let storedUser;
            try {
                storedUser = JSON.parse(storedUserJSON);
            } catch (e) {
                loginError.textContent = "Dữ liệu người dùng bị lỗi.";
                return;
            }

            // Kiểm tra mật khẩu
            if (!storedUser || storedUser.password !== password) {
                loginError.textContent = "Sai mật khẩu!";
                return;
            }

            // Lưu người dùng hiện tại vào localStorage
            localStorage.setItem("currentUser", JSON.stringify(storedUser));

            // Chuyển trang theo vai trò
            const role = storedUser.role?.toLowerCase();
            if (role === "admin") {
                window.location.href = "/pages/admin/adminDashboard.html";
            } else {
                window.location.href = "/pages/user/dashboard.html";
            }
        });
    }
});
