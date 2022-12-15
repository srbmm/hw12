import fetchClass from "./fetch.js";
const blueDiv = document.getElementById("blue-div"),
    deleteAlert = document.getElementById("delete-alert"),
    addForm = document.getElementById("add-form"),
    container = document.getElementById("container"),
    addBtn = document.getElementById("add-btn"),
    titleInp = document.getElementById("title"),
    descInp = document.getElementById("desc"),
    dueDateInp = document.getElementById("due-date"),
    saveBtn = document.getElementById("save-btn"),
    cancelBtn = document.getElementById("cancle-btn"),
    yesDeleteBtn = document.getElementById("delete-yes"),
    noDeleteBtn = document.getElementById("delete-no"),
    pageSide = document.getElementById("pages-side"),
    Server = "https://639adaf5d514150197419198.mockapi.io/todos",
    todos = document.querySelector(".todos"),
    data = new fetchClass(Server),
    Tedad = 5;
let choiceObj,
    method = "",
    page = 1;
function showDeleteAlert(obj) {
    choiceObj = obj;
    deleteAlert.classList.remove("display-none");
    blueDiv.classList.remove("display-none");
    container.classList.add("blur");
}
function showAddForm(data = {
    title: "",
    desc: "",
    dueDate: "",
}) {
    titleInp.value = data.title;
    descInp.value = data.desc;
    dueDateInp.value = data.dueDate;
    addForm.classList.remove("display-none");
    blueDiv.classList.remove("display-none");
    container.classList.add("blur");
}
function hideDeleteAlert() {
    deleteAlert.classList.add("display-none");
    blueDiv.classList.add("display-none");
    container.classList.remove("blur");
    choiceObj = undefined;
    method = "";
}
function hideAddForm() {
    addForm.classList.add("display-none");
    blueDiv.classList.add("display-none");
    container.classList.remove("blur");

}
addBtn.addEventListener("click", () => {
    showAddForm();
    method = "Post";
});
saveBtn.addEventListener("click", () => {
    hideAddForm()
    if (method === "Post") {
        data.add(
            {
                title: titleInp.value,
                desc: descInp.value,
                dueDate: dueDateInp.value,
                checked: false,
                createdAt: new Date,
                updatedAt: new Date
            }
        ).then(res => filterData())
    }else if(method === "Put"){
        data.edit(choiceObj.id, {
            title: titleInp.value,
            desc: descInp.value,
            dueDate: dueDateInp.value,
            checked: choiceObj.checked,
            createdAt: choiceObj.createdAt,
            updatedAt: new Date
        }
        ).then(res => filterData())
    }
    method = "";
    choiceObj = undefined;
});
yesDeleteBtn.addEventListener("click", function(){
    hideDeleteAlert();
    data.delete(choiceObj.id).then(res => filterData());
    choiceObj = undefined;
    method = "";

})
// for (let i = 0; i < 6; i++) {
//   data.delete(`${i}`)
// }
cancelBtn.addEventListener("click", hideAddForm);
noDeleteBtn.addEventListener("click", hideAddForm);

function filterData() {
    pageSide.innerHTML = "";
    data.get().then((res) => {
        for (let i = 1; i <= parseInt(res.length/Tedad) + 1; i++){
            const btn = document.createElement("button");
            btn.classList.add("btn");
            btn.innerText = `${i}`;
            btn.addEventListener("click", (e) =>{
                page = e.target.value;
                filterData()
            })
            console.log(pageSide);
            pageSide.appendChild(btn);
        }
        data.get(`?page=${page}&limit=${Tedad}`).then(res => renderData(res))
    }
    );
}
filterData()
function renderData(allTodos) {
    console.log(allTodos)
    todos.innerHTML = "";
    allTodos.forEach(function (item) {
        const titleDate = document.createElement('div');
        titleDate.innerHTML = `<p class="title">${item.title}</p> <p class="date">${item.dueDate}</p>`;
        titleDate.classList.add("title-date");
        const btnEdit = document.createElement('button');
        btnEdit.innerHTML =`<i class="bi bi-pencil-fill"></i>`;
        btnEdit.classList.add('btn', 'pencil');
        btnEdit.addEventListener('click', () =>{
            showAddForm(item);
            method = "Put";
            choiceObj = item;
        })
        const btnDelete = document.createElement('button');
        btnDelete.innerHTML =`<i class="bi bi-trash-fill"></i>`;
        btnDelete.classList.add('btn', 'trash');
        btnDelete.addEventListener('click', () => {
            showDeleteAlert(item);
            choiceObj = item;
            method = "Delete";
        })
        const btns = document.createElement('div');
        btns.classList.add('btns');
        btns.appendChild(btnEdit);
        btns.appendChild(btnDelete);
        const titleBtns = document.createElement('div');
        titleBtns.classList.add('title-btns');
        titleBtns.appendChild(titleDate);
        titleBtns.appendChild(btns);
        const desc = document.createElement('div');
        desc.textContent = item.desc;
        desc.classList.add('desc');
        const todoData = document.createElement('div');
        todoData.classList.add('todo-data');
        todoData.appendChild(titleBtns);
        todoData.appendChild(desc);
        const checkBox = document.createElement('button');
        checkBox.classList.add('check-box-border');
        checkBox.innerHTML = item.checked? `<i class="bi bi-check"></i>`: ``;
        checkBox.addEventListener('click', function (){
            data.edit(item.id,{
                title: item.value,
                desc: item.value,
                dueDate: item.value,
                checked: !item.checked,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }).then(res => filterData());
        })
        const todoBox = document.createElement('div');
        todoBox.classList.add('todo-box');
        todoBox.appendChild(checkBox);
        todoBox.appendChild(todoData);
        todos.appendChild(todoBox);
    })
}