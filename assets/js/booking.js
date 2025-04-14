window.addEventListener("DOMContentLoaded", function () {
    const addScheduleButton = document.querySelector(".add-schedule");
    const table = document.querySelector(".schedule-table table");
    const modal = document.getElementById("scheduleModal");
    const closeModalBtn = document.querySelector(".modal-cancel");
    const saveModalBtn = document.querySelector(".modal-save");

    const classSelect = document.getElementById("className");
    const dateInput = document.getElementById("scheduleDate");
    const timeSelect = document.getElementById("timeSlot");
    const fullnameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");

    const modalTitle = document.querySelector(".modal-title");

    const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
    const errorModalMessage = document.getElementById("errorModalMessage");

    const paginationContainer = document.getElementById("pagination");
    const itemsPerPage = 5;
    let currentPage = 1;

    let editingIndex = null;
    let deleteIndex = null;

    let scheduleList = JSON.parse(localStorage.getItem("schedules")) || [];

    function openModal(isEdit = false, data = null) {
        modal.style.display = "block";
        document.body.classList.add("modal-open");
        modalTitle.textContent = isEdit ? "Chỉnh sửa lịch tập" : "Đặt lịch mới";

        if (isEdit && data) {
            classSelect.value = data.className;
            dateInput.value = data.date;
            timeSelect.value = data.time;
            fullnameInput.value = data.fullname;
            emailInput.value = data.email;
        } else {
            classSelect.value = "";
            dateInput.value = "";
            timeSelect.value = "";
            fullnameInput.value = "";
            emailInput.value = "";
        }
    }

    function closeModal() {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
        editingIndex = null;
    }

    function renderScheduleTable(page = 1) {
        const tbody = table.querySelector("tbody") || document.createElement("tbody");
        tbody.innerHTML = "";

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, scheduleList.length);
        const paginatedList = scheduleList.slice(startIndex, endIndex);

        paginatedList.forEach((item, index) => {
            const actualIndex = startIndex + index;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.className}</td>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>${item.fullname}</td>
                <td>${item.email}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-index="${actualIndex}">Sửa</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${actualIndex}">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        if (!table.querySelector("tbody")) {
            table.appendChild(tbody);
        }

        renderPagination();
    }

    function renderPagination() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(scheduleList.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.className = "btn btn-sm btn-light m-1";
            if (i === currentPage) {
                button.classList.add("btn-primary");
            }
            button.addEventListener("click", () => {
                currentPage = i;
                renderScheduleTable(currentPage);
            });
            paginationContainer.appendChild(button);
        }
    }

    saveModalBtn.addEventListener("click", function () {
        const className = classSelect.value;
        const date = dateInput.value;
        const time = timeSelect.value;
        let fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
    
        if (!className || !date || !time || !fullname || !email) {
            errorModalMessage.textContent = "Vui lòng điền đầy đủ thông tin!";
            errorModal.show();
            return;
        }
    
        const validChars = [
            "a","ă","â","b","c","d","đ","e","ê","g","h","i","k","l","m","n",
            "o","ô","ơ","p","q","r","s","t","u","ư","v","x","y",
            "A","Ă","Â","B","C","D","Đ","E","Ê","G","H","I","K","L","M","N",
            "O","Ô","Ơ","P","Q","R","S","T","U","Ư","V","X","Y",
            "á","à","ả","ã","ạ","ắ","ằ","ẳ","ẵ","ặ","ấ","ầ","ẩ","ẫ","ậ",
            "é","è","ẻ","ẽ","ẹ","ế","ề","ể","ễ","ệ",
            "í","ì","ỉ","ĩ","ị",
            "ó","ò","ỏ","õ","ọ","ố","ồ","ổ","ỗ","ộ","ớ","ờ","ở","ỡ","ợ",
            "ú","ù","ủ","ũ","ụ","ứ","ừ","ử","ữ","ự",
            "ý","ỳ","ỷ","ỹ","ỵ",
            "Á","À","Ả","Ã","Ạ","Ắ","Ằ","Ẳ","Ẵ","Ặ","Ấ","Ầ","Ẩ","Ẫ","Ậ",
            "É","È","Ẻ","Ẽ","Ẹ","Ế","Ề","Ể","Ễ","Ệ",
            "Í","Ì","Ỉ","Ĩ","Ị",
            "Ó","Ò","Ỏ","Õ","Ọ","Ố","Ồ","Ổ","Ỗ","Ộ","Ớ","Ờ","Ở","Ỡ","Ợ",
            "Ú","Ù","Ủ","Ũ","Ụ","Ứ","Ừ","Ử","Ữ","Ự",
            "Ý","Ỳ","Ỷ","Ỹ","Ỵ",
            " "
        ];
    
        for (let i = 0; i < fullname.length; i++) {
            let char = fullname[i];
            let found = false;
            for (let j = 0; j < validChars.length; j++) {
                if (char === validChars[j]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                errorModalMessage.textContent = "Tên không được chứa số hoặc ký tự đặc biệt! Vui lòng nhập lại họ và tên!";
                errorModal.show();
                return;
            }
        }
    
        fullname = fullname
            .split(" ")
            .filter(word => word)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    
        const newSchedule = { className, date, time, fullname, email };
    
        if (editingIndex !== null) {
            scheduleList[editingIndex] = newSchedule;
        } else {
            scheduleList.push(newSchedule);
        }
    
        localStorage.setItem("schedules", JSON.stringify(scheduleList));
        renderScheduleTable(currentPage);
        closeModal();
    });
    
    closeModalBtn.addEventListener("click", closeModal);

    addScheduleButton.addEventListener("click", function () {
        editingIndex = null;
        openModal();
    });

    table.addEventListener("click", function (event) {
        const target = event.target;
        const index = parseInt(target.dataset.index);

        if (target.classList.contains("delete-btn")) {
            deleteIndex = index;
            confirmDeleteModal.show();
        }

        if (target.classList.contains("edit-btn")) {
            editingIndex = index;
            openModal(true, scheduleList[index]);
        }
    });

    document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
        if (deleteIndex !== null) {
            scheduleList.splice(deleteIndex, 1);
            localStorage.setItem("schedules", JSON.stringify(scheduleList));
            renderScheduleTable(currentPage);
            deleteIndex = null;
            confirmDeleteModal.hide();
        }
    });

    renderScheduleTable(currentPage);
});
