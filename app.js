let section = document.querySelector("section");
let add = document.querySelector("form button");

add.addEventListener("click", e => {
    e.preventDefault();
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

    if (todoText === "") {
        alert("Please Enter some Text.");
        return;
    }

    let todo = document.createElement("div");
    todo.classList.add("todo")
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + " / " + todoDate;
    todo.appendChild(text);
    todo.appendChild(time);

    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

    completeButton.addEventListener("click", e => {
        let finish = e.target.parentElement;
        finish.classList.toggle("done");
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;

        todoItem.addEventListener("animationend", () => {

            //remove from Local Storage
            let text = todoItem.children[0].innterText;
            myListArray.forEach((item, index) => {
                if (text == item.todoText) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            todoItem.remove();
        })

        todoItem.style.animation = "scaleDown 0.75s forwards";

    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.75s forwards";

    //store data into an arra of objects
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    }

    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    }
    else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));

    form.children[0].value = "";
    section.appendChild(todo);
})

loadDate();

function loadDate() {
    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {

            //create a todo
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoMonth + ' / ' + item.todoDate;
            todo.appendChild(text);
            todo.appendChild(time);

            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

            completeButton.addEventListener("click", e => {
                let finish = e.target.parentElement;
                finish.classList.toggle("done");
            })

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            trashButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;

                todoItem.addEventListener("animationend", () => {

                    //remove from Local Storage
                    let text = todoItem.children[0].innerText;
                    myListArray.forEach((item, index) => {
                        if (text == item.todoText) {
                            myListArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(myListArray));
                        }
                    })

                    todoItem.remove();
                })

                todoItem.style.animation = "scaleDown 0.75s forwards";


            })

            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            section.appendChild(todo);
        })
    }
}

function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;
    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        }
        else if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        }
        else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if (Number(arr1[i].todoDate) < Number(arr2[j].todoDate)) {
                result.push(arr1[i]);
                i++;
            }
            else if ((Number(arr1[i].todoDate) > Number(arr2[j].todoDate))) {
                result.push(arr2[j]);
                j++;
            }
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }

    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    }
    else {
        let middle = Math.floor(arr.length / 2);
        let left = arr.slice(0, middle);
        let right = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(left), mergeSort(right));
    }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    loadDate();
})