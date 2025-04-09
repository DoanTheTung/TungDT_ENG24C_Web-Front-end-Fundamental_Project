document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

        if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let fullname = document.getElementById("fullname").value.trim();
            let email = document.getElementById("email").value.trim().toLowerCase();
            let password = document.getElementById("password").value;
            let confirmPassword = document.getElementById("confirmPassword").value;
            let registerError = document.getElementById("registerError");

            if (registerError) registerError.innerText = "";

            if (!fullname) {
                if (registerError) registerError.innerText = "Họ và tên không được để trống";
                return;
            }
            if (!email) {
                if (registerError) registerError.innerText = "Email không được để trống";
                return;
            }
            if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
                if (registerError) registerError.innerText = "Email phải đúng định dạng";
                return;
            }
            if (password.length < 8) {
                if (registerError) registerError.innerText = "Mật khẩu tối thiểu 8 ký tự";
                return;
            }
            if (password !== confirmPassword) {
                if (registerError) registerError.innerText = "Mật khẩu không trùng khớp";
                return;
            }

            if (localStorage.getItem(email)) {
                if (registerError) registerError.innerText = "Email đã được sử dụng!";
                return;
            }

            let user = {
                fullname: fullname,
                email: email,
                password: password,
            };
            localStorage.setItem(email, JSON.stringify(user));
            window.location.href = "/pages/auth/login.html";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let email = document.getElementById("loginEmail").value.trim().toLowerCase();
            let password = document.getElementById("loginPassword").value;
            let loginError = document.getElementById("loginError");

            if (loginError) loginError.innerText = "";

            if (!email) {
                if (loginError) loginError.innerText = "Email không được để trống";
                return;
            }
            if (!password) {
                if (loginError) loginError.innerText = "Mật khẩu không được để trống";
                return;
            }

            let storedUser = localStorage.getItem(email);

            if (!storedUser) {
                if (loginError) loginError.innerText = "Email chưa được đăng ký!";
                return;
            }

            storedUser = JSON.parse(storedUser);

            if (storedUser.password !== password) {
                if (loginError) loginError.innerText = "Sai mật khẩu!";
                return;
            }
            localStorage.setItem("currentUser", email);
            window.location.href = "/pages/admin/dashboard.html";
        });
    }
});
