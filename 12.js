const API_URL = "https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos";
const productsTable = document.querySelector(".table tbody");
const productForm = document.querySelector("#create-product");
const editModal = document.querySelector("#editModal");
let close=document.querySelector('#btn-add-product')
let toast=document.querySelector('#toast')
const DEFAULT_PAGE_SIZE = 4;
const count=44
let title=document.querySelector('#title')
let liveToastBtn=document.querySelector('#liveToastBtn')
let validation=document.querySelector('#validation')
let liveToast=document.querySelector('#liveToast')






// Create
async function createNewProduct(e) {
    e.preventDefault();
    const newProduct = gatherFormData(e);
    try {
        const res = await fetch(`${API_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        });
        const createdProduct = await res.json();
        addToDOM(createdProduct);
    } catch (e) {
        console.log(e);
    }
}

function gatherFormData(e) {
    const { title, description, dueDate } = e.target;
    return {
        title: title.value,
        description: description.value,
        dueDate: dueDate.value,
    };
}


productForm.addEventListener("submit", createNewProduct);

// Read
async function readProducts(page = 1) {
    productsTable.innerHTML = "";

    try {
        const res = await fetch(
            `${API_URL}?page=${page}&limit=${DEFAULT_PAGE_SIZE}`
        );
        const data = await res.json();
        data.forEach(addToDOM);
        createPagination(count,page );
    } catch (e) {
        console.log(e);
    }
}

function addToDOM(product) {
    const productRow = document.createElement("tr");
    productRow.dataset.id = product.id;
    productRow.style.lineHeight = "40px";
    const { titleCell, descriptionCell, dueDateCell,actionCell } =
        generateTableCells(product);

    productRow.appendChild(titleCell);
    productRow.appendChild(descriptionCell);
    productRow.appendChild(dueDateCell);
    productRow.appendChild(actionCell);

    productsTable.appendChild(productRow);
}

function generateTableCells(product) {
    const titleCell = document.createElement("td");
    titleCell.innerHTML = product.title;
    titleCell.title = product.title;

    const descriptionCell = document.createElement("td");
    descriptionCell.innerHTML = product.description;
    descriptionCell.title = product.description;

    const dueDateCell = document.createElement("td");
    const date = new Date(product.dueDate).toDateString();
    dueDateCell.innerHTML = date;
    dueDateCell.title = date;

    const viewButton = document.createElement("button");
    viewButton.dataset.id = product.id;
    viewButton.innerHTML = '<i class="bi bi-eye"></i>';
    viewButton.title = "VIEW";
    viewButton.className = "btn btn-warning btn-sm m-1 text-white";
    viewButton.dataset.bsToggle = "modal";
    viewButton.dataset.bsTarget = "#viewModal";
    viewButton.addEventListener("click", () => viewProduct(product));

    const editButton = document.createElement("button");
    editButton.dataset.id = product.id;
    editButton.innerHTML = '<i class="bi bi-pen"></i>';
    editButton.title = "UPDATE";
    editButton.className = "btn btn-primary btn-sm";
    editButton.dataset.bsToggle = "modal";
    editButton.dataset.bsTarget = "#editModal";
    editButton.addEventListener("click", () => editProduct(product));

    const deleteButton = document.createElement("button");
    deleteButton.dataset.id = product.id;
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
    deleteButton.title = "DELETE";
    deleteButton.className = "btn btn-danger btn-sm m-1";
    deleteButton.dataset.bsToggle = "modal";
    deleteButton.dataset.bsTarget = "#deleteModal";
    deleteButton.addEventListener("click", () => removeProduct(product.id));

    const actionCell = document.createElement("td");
    actionCell.appendChild(viewButton);
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
    return {titleCell, descriptionCell, dueDateCell, actionCell };
}

readProducts();
// --------------------------------------------------------------------------------------------
async function readProduct(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        return res.json();
    } catch (e) {
        console.log(e.message);
    }
}

async function viewProduct(product) {
    const productWithDetails = await readProduct(product.id);
    const viewModal = document.querySelector("#viewModal .modal-body");
    viewModal.querySelector("#createdAt").innerHTML =
        productWithDetails.createdAt;
    viewModal.querySelector("#updatedAt").innerHTML =
        productWithDetails.updatedAt;
    viewModal.querySelector("#checked").innerHTML = productWithDetails.checked;
}
// ---------------------------------------------------------------------------------------------
function editProduct(product) {
    editModal.querySelector("#name").value = product.title;
    editModal.querySelector("#price").value = product.description;
    editModal.querySelector("#countInStock").value = product.dueDate;
    editModal.querySelector("#confirm-edit-btn").dataset.id = product.id;
}

document.querySelector("#confirm-edit-btn").addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    updateProduct(id);
});

function gatherEditFormData() {
    const title = editModal.querySelector("#name");
    const description = editModal.querySelector("#price");
    const dueDate = editModal.querySelector("#countInStock");
    return {
        title: title.value,
        description: description.value,
        dueDate: dueDate.value,
    };
}
async function updateProduct(id) {
    const updatedProduct = gatherEditFormData();
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedProduct),
            headers: { "Content-Type": "application/json" },
        });
        readProducts();
    } catch (e) {
        console.log(error.message);
    }
}
// -------------------------------------------------------------------------------------------
function removeProduct(id) {
    document.querySelector("#confirm-delete-btn").dataset.id = id;
}

document.querySelector("#confirm-delete-btn").addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    deleteProduct(id);
});

async function deleteProduct(productId) {
    try {
        await fetch(`${API_URL}/${productId}`, { method: "DELETE" });
        readProducts();
    } catch (e) {
        console.log(e.message);
    }
}
// ---------------------------------------------------------------------------------------------

function createPagination(productCount, currentPage) {
    const pageCount = Math.ceil(productCount / DEFAULT_PAGE_SIZE);
    let lis = "";
    for (let i = 1; i <= pageCount; i++) {
        lis += `<li class="page-item ${
            i === currentPage ? "active" : ""
        }"><a href="#" class="page-link">${i}</a></li>`;
    }
    document.querySelector("ul.pagination").innerHTML = lis;
}

document.querySelector("ul.pagination").addEventListener("click", (e) => {
    const lis = document.querySelectorAll(".page-item");
    lis.forEach((li) => li.classList.remove("active"));
    e.target.parentElement.classList.add("active");
    const currentPage = Number(e.target.innerText);
    readProducts(currentPage);
});
// --------------------------------------



//
// close.addEventListener('click',(e)=>{
//     e.preventDefault();
//
//
//     if (title.value==''){
//         title.style.border='1px solid red'
//         validation.innerHTML='title is required'
//         validation.style.color='red'
//         validation.style.fontSize='14px'
//     }
//     else{
//         liveToast.classList.remove('hide')
//         liveToast.classList.add('show')
//         liveToastBtn.innerHTML='submit';
//     }
//
// })
// liveToastBtn.addEventListener('click',()=>{
//     toast.innerHTML=""
// })