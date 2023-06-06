window.addEventListener('load', () => {
    const form = document.querySelector("#new-toDo-form")
    const input = document.querySelector("#new-toDo-input")
    const elementList = document.querySelector("#toDo-items")

    // Keeps todolist items made
    const savedItems = JSON.parse(localStorage.getItem("toDo-items")) || [];
    for (const itemText of savedItems) {
        createTodoItem(itemText);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const item = input.value;
        if (!item) {
            alert("Please fill out a TODO item");
            return;
        }

        createTodoItem(item);

        input.value = "";
    });

    document.querySelectorAll('.dropdown-toggle').forEach(dropDownFunc);
    // Dropdown Open and Close function
    function dropDownFunc(dropDown) {
        console.log(dropDown.classList.contains('click-dropdown'));

        if (dropDown.classList.contains('click-dropdown') === true) {
            dropDown.addEventListener('click', function (e) {
                e.preventDefault();

                if (this.nextElementSibling.classList.contains('dropdown-active') === true) {
                    // Close the clicked dropdown
                    this.parentElement.classList.remove('dropdown-open');
                    this.nextElementSibling.classList.remove('dropdown-active');

                } else {
                    // Close the opend dropdown
                    closeDropdown();

                    // add the open and active class(Opening the DropDown)
                    this.parentElement.classList.add('dropdown-open');
                    this.nextElementSibling.classList.add('dropdown-active');
                }
            });
        }

        if (dropDown.classList.contains('hover-dropdown') === true) {

            dropDown.onmouseover = dropDown.onmouseout = dropdownHover;

            function dropdownHover(e) {
                if (e.type == 'mouseover') {
                    // Close the opend dropdowns
                    closeDropdown();

                    // add the open and active class(Opening the DropDown)
                    this.parentElement.classList.add('dropdown-open');
                    this.nextElementSibling.classList.add('dropdown-active');

                }

                // if(e.type == 'mouseout'){
                //     // close the dropdown after user leave the list
                //     e.target.nextElementSibling.onmouseleave = closeDropdown;
                // }
            }
        }

    };

    // Listen to the doc click
    window.addEventListener('click', function (e) {

        // Close the menu if click happen outside menu
        if (e.target.closest('.dropdown-container') === null) {
            // Close the opend dropdown
            closeDropdown();
        }

    });


    // Close the openend Dropdowns
    function closeDropdown() {
        console.log('run');

        // remove the open and active class from other opened Dropdown (Closing the opend DropDown)
        document.querySelectorAll('.dropdown-container').forEach(function (container) {
            container.classList.remove('dropdown-open')
        });

        document.querySelectorAll('.dropdown-menu').forEach(function (menu) {
            menu.classList.remove('dropdown-active');
        });
    }

    // close the dropdown on mouse out from the dropdown list
    document.querySelectorAll('.dropdown-menu').forEach(function (dropDownList) {
        // close the dropdown after user leave the list
        dropDownList.onmouseleave = closeDropdown;
    });


    sortButton.addEventListener('click', () => {
        const todoItems = Array.from(elementList.querySelectorAll(".toDo-item .text"));
        const sortedItems = [...todoItems].sort((a, b) => {
            const textA = a.value.toLowerCase();
            const textB = b.value.toLowerCase();
            // Sort in ascending (A-Z) order
            // For descending (Z-A) order, change the comparison to: return textB.localeCompare(textA);
            return textA.localeCompare(textB);
        });

        // Clear the list
        elementList.innerHTML = "";

        // Add the sorted items back to the list
        sortedItems.forEach((item) => {
            createTodoItem(item.value);
        });
    });

    function createTodoItem(itemText) {
        const item_el = document.createElement("div");
        item_el.classList.add("toDo-item");

        const item_content_el = document.createElement("div");
        item_content_el.classList.add("content");

        item_el.appendChild(item_content_el);

        const item_input_el = document.createElement("input");
        item_input_el.classList.add("text");
        item_input_el.type = "text";
        item_input_el.value = itemText;
        item_input_el.setAttribute("readonly", "readonly");

        item_content_el.appendChild(item_input_el);

        const item_actions_el = document.createElement("div");
        item_actions_el.classList.add("actions");

        const item_edit_el = document.createElement("button");
        item_edit_el.classList.add("edit");
        item_edit_el.innerHTML = "Edit";

        const item_delete_el = document.createElement("button");
        item_delete_el.classList.add("delete");
        item_delete_el.innerHTML = "Delete";

        item_actions_el.appendChild(item_edit_el);
        item_actions_el.appendChild(item_delete_el);

        item_el.appendChild(item_actions_el);

        elementList.appendChild(item_el);

        item_edit_el.addEventListener('click', () => {
            if (item_edit_el.innerText.toLowerCase() == "edit") {
                item_input_el.removeAttribute("readonly");
                item_input_el.focus();
                item_edit_el.innerText = "Save";
            } else {
                item_input_el.setAttribute("readonly", "readonly");
                item_edit_el.innerText = "Edit";
            }

            // Save the updated todo items to localStorage
            const todoItems = Array.from(elementList.querySelectorAll(".toDo-item .text"))
                .map((inputEl) => inputEl.value);
            localStorage.setItem("toDo-items", JSON.stringify(todoItems));
        });

        item_delete_el.addEventListener('click', () => {
            elementList.removeChild(item_el);

            // Save the updated todo items to localStorage
            const todoItems = Array.from(elementList.querySelectorAll(".toDo-item .text"))
                .map((inputEl) => inputEl.value);
            localStorage.setItem("toDo-items", JSON.stringify(todoItems));
        });
    }
});