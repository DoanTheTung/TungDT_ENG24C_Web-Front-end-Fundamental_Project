document.addEventListener("DOMContentLoaded", () => {
    const addServiceBtn = document.querySelector(".add-service");
    const serviceTable = document.querySelector(".service-table table");
    const serviceTableBody = document.createElement("tbody");
    serviceTable.appendChild(serviceTableBody);

    const paginationContainer = document.createElement("div");
    paginationContainer.className = "pagination";
    serviceTable.parentElement.appendChild(paginationContainer);

    let services = [];
    let currentPage = 1;
    const itemsPerPage = 5;

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.innerHTML = `
        <div class="modal">
            <h2>Thêm Dịch Vụ</h2>
            <input type="text" id="serviceName" placeholder="Tên dịch vụ">
            <textarea id="serviceDesc" placeholder="Mô tả dịch vụ"></textarea>
            <input type="text" id="imageUrl" placeholder="URL hình ảnh (tùy chọn)">
            <p id="modalError" class="modal-error"></p>
            <div class="modal-buttons">
                <button id="saveModal">Lưu</button>
                <button id="cancelModal">Hủy</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);
    modalOverlay.style.display = "none";

    const serviceNameInput = modalOverlay.querySelector("#serviceName");
    const serviceDescInput = modalOverlay.querySelector("#serviceDesc");
    const imageUrlInput = modalOverlay.querySelector("#imageUrl");
    const modalError = modalOverlay.querySelector("#modalError");
    const saveModalBtn = modalOverlay.querySelector("#saveModal");
    const cancelModalBtn = modalOverlay.querySelector("#cancelModal");

    const confirmOverlay = document.createElement("div");
    confirmOverlay.className = "modal-overlay";
    confirmOverlay.innerHTML = `
        <div class="modal">
            <h3>Bạn có chắc muốn xoá dịch vụ này không?</h3>
            <div class="modal-buttons">
                <button id="confirmDelete">Xác nhận</button>
                <button id="cancelDelete">Hủy</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmOverlay);
    confirmOverlay.style.display = "none";

    const cancelDeleteBtn = confirmOverlay.querySelector("#cancelDelete");
    const confirmDeleteBtn = confirmOverlay.querySelector("#confirmDelete");

    let rowToDelete = null;

    function showModal() {
        serviceNameInput.value = "";
        serviceDescInput.value = "";
        imageUrlInput.value = "";
        modalError.textContent = "";
        modalOverlay.style.display = "flex";
    }

    function closeModal() {
        modalOverlay.style.display = "none";
    }

    function showConfirmModal(row) {
        rowToDelete = row;
        confirmOverlay.style.display = "flex";
    }

    function closeConfirmModal() {
        confirmOverlay.style.display = "none";
        rowToDelete = null;
    }

    function renderPagination() {
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(services.length / itemsPerPage);
        if (totalPages <= 1) return;

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "← Trước";
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener("click", () => {
            currentPage--;
            renderServices();
        });

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Tiếp →";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener("click", () => {
            currentPage++;
            renderServices();
        });

        paginationContainer.appendChild(prevBtn);
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            if (i === currentPage) pageBtn.classList.add("active");
            pageBtn.addEventListener("click", () => {
                currentPage = i;
                renderServices();
            });
            paginationContainer.appendChild(pageBtn);
        }
        paginationContainer.appendChild(nextBtn);
    }

    function renderServices() {
        serviceTableBody.innerHTML = "";

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageServices = services.slice(start, end);

        pageServices.forEach((service, index) => {
            const realIndex = start + index;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${service.name}</td>
                <td>${service.desc}</td>
                <td>${service.img ? `<img src="${service.img}" width="50">` : "Không có hình ảnh"}</td>
                <td><button class="delete-btn" data-index="${realIndex}">Xóa</button></td>
            `;
            serviceTableBody.appendChild(row);
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                rowToDelete = btn.closest("tr");
                rowToDelete.dataset.index = index;
                showConfirmModal(rowToDelete);
            });
        });

        renderPagination();
    }

    function saveServicesToStorage() {
        localStorage.setItem("services", JSON.stringify(services));
    }

    function loadServicesFromStorage() {
        const stored = localStorage.getItem("services");
        if (stored) {
            services = JSON.parse(stored);
            renderServices();
        }
    }

    addServiceBtn.addEventListener("click", showModal);
    cancelModalBtn.addEventListener("click", closeModal);

    saveModalBtn.addEventListener("click", () => {
        const name = serviceNameInput.value.trim();
        const desc = serviceDescInput.value.trim();
        const img = imageUrlInput.value.trim();

        if (!name || !desc) {
            modalError.textContent = "Vui lòng nhập đầy đủ tên và mô tả dịch vụ!";
            return;
        }

        services.push({ name, desc, img });
        saveServicesToStorage();

        const totalPages = Math.ceil(services.length / itemsPerPage);
        currentPage = totalPages;
        renderServices();
        closeModal();
    });

    cancelDeleteBtn.addEventListener("click", closeConfirmModal);

    confirmDeleteBtn.addEventListener("click", () => {
        if (rowToDelete) {
            const index = rowToDelete.dataset.index;
            services.splice(index, 1);
            saveServicesToStorage();

            const maxPages = Math.ceil(services.length / itemsPerPage);
            if (currentPage > maxPages) currentPage = maxPages;

            renderServices();
        }
        closeConfirmModal();
    });

    loadServicesFromStorage();
});
