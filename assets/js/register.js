document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

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

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fullname = document.getElementById("fullname")?.value.trim();
            const email = document.getElementById("email")?.value.trim().toLowerCase();
            const password = document.getElementById("password")?.value;
            const confirmPassword = document.getElementById("confirmPassword")?.value;
            const registerError = document.getElementById("registerError");

            if (registerError) registerError.textContent = "";

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

            const newUser = {
                fullname,
                email,
                password,
                role: "user"
            };

            localStorage.setItem(email, JSON.stringify(newUser));
            window.location.href = "/pages/auth/login.html";
        });
    }
});
