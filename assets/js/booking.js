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
        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();

        if (!className || !date || !time || !fullname || !email) {
            errorModalMessage.textContent = "Vui lòng điền đầy đủ thông tin!";
            errorModal.show();
            return;
        }

        // if (fullname.toLowerCase().includes("tùng")) {
        //     errorModalMessage.textContent = "Xin lỗi, người dùng tên 'Tùng' đang bị cấm đặt lịch!";
        //     errorModal.show();
        //     fullnameInput.classList.add("input-error");
        //     return;
        // } else {
        //     fullnameInput.classList.remove("input-error");
        // }

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
