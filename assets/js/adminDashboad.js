
window.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("table");
    const classFilter = document.getElementById("class");
    const emailFilter = document.getElementById("email");
    const dateFilter = document.getElementById("date");

    const gymCountSpan = document.querySelector(".stat-box:nth-child(1) span");
    const yogaCountSpan = document.querySelector(".stat-box:nth-child(2) span");
    const zumbaCountSpan = document.querySelector(".stat-box:nth-child(3) span");

    const paginationContainer = document.createElement("div");
    paginationContainer.className = "pagination";
    table.parentElement.appendChild(paginationContainer);

    const modal = document.getElementById("editModal");
    const classInput = document.getElementById("editClass");
    const dateInput = document.getElementById("editDate");
    const timeInput = document.getElementById("editTime");
    const nameInput = document.getElementById("editName");
    const emailInput = document.getElementById("editEmail");
    const saveEditBtn = document.getElementById("saveEditBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");

    const deleteModal = document.getElementById("deleteModal");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

    let scheduleList = JSON.parse(localStorage.getItem("schedules")) || [];
    let currentPage = 1;
    const recordsPerPage = 5;
    let editingIndex = null;
    let scheduleToDelete = null;

    function populateClassFilterOptions() {
        const classNames = [...new Set(scheduleList.map(item => item.className))];
        classNames.forEach(cls => {
            const option = document.createElement("option");
            option.value = cls;
            option.textContent = cls;
            classFilter.appendChild(option);
        });
    }

    function updateStats(filteredList) {
        let gym = 0, yoga = 0, zumba = 0;
        filteredList.forEach(item => {
            if (item.className === "Gym") gym++;
            else if (item.className === "Yoga") yoga++;
            else if (item.className === "Zumba") zumba++;
        });
        gymCountSpan.textContent = gym;
        yogaCountSpan.textContent = yoga;
        zumbaCountSpan.textContent = zumba;
    }

    function renderTable(data) {
        let tbody = table.querySelector("tbody");
        if (!tbody) {
            tbody = document.createElement("tbody");
            table.appendChild(tbody);
        }
        tbody.innerHTML = "";

        data.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.className}</td>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>${item.fullname}</td>
                <td>${item.email}</td>
                <td>
                    <button class="btn-edit" data-index="${index}">Sửa</button>
                    <button class="btn-delete" data-index="${index}">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function filterData() {
        let filtered = [...scheduleList];
        const selectedClass = classFilter.value;
        const emailText = emailFilter.value.trim().toLowerCase();
        const selectedDate = dateFilter.value;

        if (selectedClass !== "Tất cả") {
            filtered = filtered.filter(item => item.className === selectedClass);
        }

        if (emailText) {
            filtered = filtered.filter(item => item.email.toLowerCase().includes(emailText));
        }

        if (selectedDate) {
            filtered = filtered.filter(item => item.date === selectedDate);
        }

        return filtered;
    }

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / recordsPerPage);
        paginationContainer.innerHTML = "";
        if (totalPages <= 1) return;

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "«";
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            currentPage--;
            refreshDisplay();
        };
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            if (i === currentPage) pageBtn.classList.add("active");
            pageBtn.onclick = () => {
                currentPage = i;
                refreshDisplay();
            };
            paginationContainer.appendChild(pageBtn);
        }

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "»";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            currentPage++;
            refreshDisplay();
        };
        paginationContainer.appendChild(nextBtn);
    }

    function refreshDisplay() {
        const filtered = filterData();
        const startIndex = (currentPage - 1) * recordsPerPage;
        const paginated = filtered.slice(startIndex, startIndex + recordsPerPage);
        renderTable(paginated);
        updateStats(filtered);
        renderPagination(filtered.length);
    }

    table.addEventListener("click", function (e) {
        const btn = e.target;
        const row = btn.closest("tr");
        const index = Array.from(row.parentNode.children).indexOf(row);
        const filtered = filterData();
        const realIndex = scheduleList.indexOf(filtered[index]);

        if (btn.classList.contains("btn-delete")) {
            scheduleToDelete = realIndex;
            deleteModal.style.display = "flex";
        }

        if (btn.classList.contains("btn-edit")) {
            editingIndex = realIndex;
            const schedule = scheduleList[editingIndex];
            classInput.value = schedule.className;
            dateInput.value = schedule.date;
            timeInput.value = schedule.time;
            nameInput.value = schedule.fullname;
            emailInput.value = schedule.email;
            modal.style.display = "flex";
        }
    });

    confirmDeleteBtn.addEventListener("click", function () {
        if (scheduleToDelete !== null) {
            scheduleList.splice(scheduleToDelete, 1);
            localStorage.setItem("schedules", JSON.stringify(scheduleList));
            refreshDisplay();
            scheduleToDelete = null;
            deleteModal.style.display = "none";
        }
    });

    cancelDeleteBtn.addEventListener("click", function () {
        scheduleToDelete = null;
        deleteModal.style.display = "none";
    });

    saveEditBtn.addEventListener("click", function () {
        if (editingIndex !== null) {
            scheduleList[editingIndex] = {
                className: classInput.value,
                date: dateInput.value,
                time: timeInput.value,
                fullname: nameInput.value,
                email: emailInput.value
            };
            localStorage.setItem("schedules", JSON.stringify(scheduleList));
            refreshDisplay();
            modal.style.display = "none";
            editingIndex = null;
        }
    });

    cancelEditBtn.addEventListener("click", function () {
        modal.style.display = "none";
        editingIndex = null;
    });

    classFilter.addEventListener("change", () => {
        currentPage = 1;
        refreshDisplay();
    });
    emailFilter.addEventListener("input", () => {
        currentPage = 1;
        refreshDisplay();
    });
    dateFilter.addEventListener("change", () => {
        currentPage = 1;
        refreshDisplay();
    });

    populateClassFilterOptions();
    refreshDisplay();
});