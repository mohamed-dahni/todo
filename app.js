// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const grocery = document.getElementById('grocery');
const clearBtn = document.querySelector('.clear-btn');
const submitBtn = document.querySelector('.submit-btn');

// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem);
// clear items
clearBtn.addEventListener('click', clearItems);
// setup localstorage items
window.addEventListener('DOMContentLoaded', setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {

        const element = makeElement(id, value);

        // append child
        list.appendChild(element);
        // show container
        container.classList.add('show-container');
        // display alert
        displayAlert("item added to the list", "success");

        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();

    } else if (value && editFlag) {
        editElement.textContent = value;
        displayAlert("item changed", "success");

        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    } else {
        displayAlert("please enter a value", "danger");
    }
}

// display alert
function displayAlert(text, cat) {
    alert.textContent = text;
    alert.classList.add(`alert-${cat}`);

    // clear alert after a second
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${cat}`);
    }, 1000);
}

// add to local storage
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// clear items
function clearItems() {
    const items = list.querySelectorAll('.grocery-item');

    if (items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item);
        });
    }
    
    // hide container
    container.classList.remove('show-container');
    // display alert
    displayAlert('empty list', 'danger');
    // clear input 
    setBackToDefault();
    localStorage.removeItem('list');

}

// delete item
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    displayAlert("item removed", "danger");

    
    if (list.children.length === 0) {
        container.classList.remove('show-container');
    }

    setBackToDefault();
    // remove item from local storage
    removeFromLocalStorage(id);
}

// edit item
function editItem(e) {
    editElement = e.currentTarget.parentElement.previousElementSibling;
    editFlag = true;
    editID = editElement.parentElement.dataset.id;

    submitBtn.textContent = "edit";
    grocery.value = editElement.innerHTML;
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    let items = getListItems();
    items.push({id, value});

    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getListItems();
    items = items.filter((item) => {
        return item.id !== id;
    });

    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getListItems();
    console.log("hello");
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value;
            return item;
        }
        return item;
    });

    localStorage.setItem('list', JSON.stringify(items));
}

function getListItems() {
    return (localStorage.getItem('list')) 
        ? JSON.parse(localStorage.getItem('list'))
        : [];
}

// ****** SETUP ITEMS **********
function setupItems() {
    let items = getListItems();

    if (items.length > 0) {
        items.forEach((item) => {
            const element = makeElement(item.id, item.value);
            list.appendChild(element);
        })

        container.classList.add('show-container');
    }
}

function makeElement(id, value) {
    const element = document.createElement('article');
    // add class name
    element.classList.add('grocery-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);

    element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
        </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    // delete item
    deleteBtn.addEventListener('click', deleteItem);
    // edit item 
    editBtn.addEventListener('click', editItem);
    return element;
}