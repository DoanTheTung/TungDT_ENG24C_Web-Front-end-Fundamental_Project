document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

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

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");
            const loginError = document.getElementById("loginError");

            if (loginError) loginError.textContent = "";

            if (!emailInput || !passwordInput) {
                if (loginError) loginError.textContent = "Thiếu trường thông tin đăng nhập.";
                return;
            }

            const email = emailInput.value.trim().toLowerCase();
            const password = passwordInput.value.trim();

            if (!email) {
                loginError.textContent = "Email không được để trống";
                return;
            }

            if (!password) {
                loginError.textContent = "Mật khẩu không được để trống";
                return;
            }

            const storedUserJSON = localStorage.getItem(email);
            if (!storedUserJSON) {
                loginError.textContent = "Email chưa được đăng ký!";
                return;
            }

            let storedUser;
            try {
                storedUser = JSON.parse(storedUserJSON);
            } catch (e) {
                loginError.textContent = "Dữ liệu người dùng bị lỗi.";
                return;
            }

            if (!storedUser || storedUser.password !== password) {
                loginError.textContent = "Sai mật khẩu!";
                return;
            }

            localStorage.setItem("currentUser", JSON.stringify(storedUser));

            const role = storedUser.role?.toLowerCase();
            if (role === "admin") {
                window.location.href = "/pages/admin/adminDashboard.html";
            } else {
                window.location.href = "/pages/user/dashboard.html";
            }
        });
    }
});
