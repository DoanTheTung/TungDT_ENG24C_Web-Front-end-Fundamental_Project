document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

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

    // Nếu có form đăng ký thì lắng nghe sự kiện submit
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // Lấy dữ liệu từ form
            const fullname = document.getElementById("fullname")?.value.trim();
            const email = document.getElementById("email")?.value.trim().toLowerCase();
            const password = document.getElementById("password")?.value;
            const confirmPassword = document.getElementById("confirmPassword")?.value;
            const registerError = document.getElementById("registerError");

            if (registerError) registerError.textContent = "";

            // Kiểm tra dữ liệu đầu vào
            if (!fullname) {
                registerError.textContent = "Họ và tên không được để trống";
                return;
            }
            if (!email) {
                registerError.textContent = "Email không được để trống";
                return;
            }
            if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
                registerError.textContent = "Email phải đúng định dạng";
                return;
            }
            if (password.length < 8) {
                registerError.textContent = "Mật khẩu tối thiểu 8 ký tự";
                return;
            }
            if (password !== confirmPassword) {
                registerError.textContent = "Mật khẩu không trùng khớp";
                return;
            }
            if (localStorage.getItem(email)) {
                registerError.textContent = "Email đã được sử dụng!";
                return;
            }

            // Lưu người dùng mới vào localStorage
            const newUser = {
                fullname,
                email,
                password,
                role: "user"
            };

            localStorage.setItem(email, JSON.stringify(newUser));

            // Chuyển hướng sang trang đăng nhập
            window.location.href = "/pages/auth/login.html";
        });
    }
});
