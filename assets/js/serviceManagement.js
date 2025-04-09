document.addEventListener("DOMContentLoaded", () => {
    const addServiceBtn = document.querySelector(".add-service");
    const serviceTable = document.querySelector(".service-table table");
    const serviceTableBody = document.createElement("tbody");
    serviceTable.appendChild(serviceTableBody);

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
                <button id="saveModal"> Lưu </button>
                <button id="cancelModal"> Hủy </button>
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

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${name}</td>
            <td>${desc}</td>
            <td>${img ? `<img src="${img}" width="50">` : "Không có hình ảnh"}</td>
            <td><button class="delete-btn">Xóa</button></td>
        `;

        serviceTableBody.appendChild(newRow);
        attachDeleteEvent(newRow.querySelector(".delete-btn"));

        closeModal();
    });

    function attachDeleteEvent(button) {
        button.addEventListener("click", () => {
            const row = button.closest("tr");
            showConfirmModal(row);
        });
    }

    cancelDeleteBtn.addEventListener("click", closeConfirmModal);

    confirmDeleteBtn.addEventListener("click", () => {
        if (rowToDelete) {
            rowToDelete.remove();
        }
        closeConfirmModal();
    });
});
