window.addEventListener('load', () => {
    const form = document.querySelector("#new-toDo-form")
    const input = document.querySelector("#new-toDo-input")
    const elementList = document.querySelector("#toDo-items")

    // Keeps todolist items made for custom sort
    let customItemsList = [];

    //******* EL for Add ToDo Item *******
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const item = input.value;
        if (!item) {
            alert("Please fill out a TODO item");
            return;
        }

        createTodoItem(item);
        // Push the item text to the customItemsList array
        customItemsList.push(item);
        console.log(customItemsList);

        // Depending on sort chosen update the item list if its not any of the three do nothing
        if (sortDropdown.textContent === "A-Z" ||
            sortDropdown.textContent === "Z-A" ||
            sortDropdown.textContent === "Custom") {
            // if Custom sort is active need to sort and play animation
            if (sortDropdown.textContent === "Custom") {
                sortTodoItems(sortDropdown.textContent);
                customSortAnimation();
            } else { sortTodoItems(sortDropdown.textContent); }
        }
        else { /* Do nothing where there is no sort active */ }

        // customItemsList.forEach(function (entry) {
        //     console.log(entry);
        // });
        input.value = ""; // Reset input for next ToDo Item
    });

    //******* Dropdown Code Start *******
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
        // close the dropdown after user hovers off the dropdown
        dropDownList.onmouseleave = closeDropdown;
    });

    document.querySelectorAll('.dropdown-menu a').forEach((a) => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const sortType = a.innerText;

            if (sortDropdown.innerText !== sortType) {
                // Update the dropdown menu with the selected sort type
                sortDropdown.innerText = sortType;
                // Sort the todo items based on the selected sort type
                sortTodoItems(sortType);
                if (sortType === "Custom") {
                    customSortAnimation();
                }
            }
        });
    });
    //******* Dropdown Code End *******

    //******* Creates ToDo Item DOM *******    
    function createTodoItem(itemText) {
        const item_el = document.createElement("div");
        item_el.classList.add("toDo-item", "fade-in"); // Add "fade-in" class to trigger fade-in animation

        const item_content_el = document.createElement("div");
        item_content_el.classList.add("content");

        item_el.appendChild(item_content_el);

        const arrowUp = document.createElement("button");
        arrowUp.innerHTML = "&#8593;";
        arrowUp.classList.add("arrow", "up-arrow");
        arrowUp.addEventListener('click', () => {
            const currentItem = item_el;
            const previousItem = currentItem.previousElementSibling;
            if (previousItem) {
                elementList.insertBefore(currentItem, previousItem);
                swapCustomItemsList(itemText, previousItem);
            }
        });

        const arrowDown = document.createElement("button");
        arrowDown.innerHTML = "&#8595;";
        arrowDown.classList.add("arrow", "down-arrow");
        arrowDown.addEventListener('click', () => {
            const currentItem = item_el;
            const nextItem = currentItem.nextElementSibling;
            if (nextItem) {
                elementList.insertBefore(nextItem, currentItem);
                swapCustomItemsList(itemText, nextItem);
            }
        });

        // Create a wrapper element to contain the arrow and the input element
        const arrowWrapper = document.createElement("div");
        arrowWrapper.classList.add("arrow-wrapper");
        arrowWrapper.appendChild(arrowUp);
        arrowWrapper.appendChild(arrowDown);

        const item_input_el = document.createElement("input");
        item_input_el.classList.add("text");
        item_input_el.type = "text";
        item_input_el.value = itemText;
        item_input_el.setAttribute("readonly", "readonly");

        item_content_el.appendChild(arrowWrapper);
        item_content_el.appendChild(item_input_el);


        //creation of edit and delete buttons
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
            // like arrays temp variable is a reference to the item_input_el element, and the element itself is changing like arrays
            let temp = Object.assign({}, item_input_el); // Object.assign like array.clone
            if (item_edit_el.innerText.toLowerCase() == "edit") {
                item_input_el.style.setProperty("color", "var(--lightBlue)"); // change color for better visibility
                item_input_el.removeAttribute("readonly");
                item_input_el.focus();
                item_edit_el.innerText = "Save";
            } else {
                item_input_el.style.setProperty("color", "var(--light)"); // revert back to default color
                item_input_el.setAttribute("readonly", "readonly");
                if (item_input_el.value !== temp) {
                    sortTodoItems(sortDropdown.textContent);
                }
                item_edit_el.innerText = "Edit";
            }

            // Save the updated todo items to localStorage
            const todoItems = Array.from(elementList.querySelectorAll(".toDo-item .text"))
                .map((inputEl) => inputEl.value);
            localStorage.setItem("toDo-items", JSON.stringify(todoItems));
        });

        item_input_el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { // Press Enter key to edit item
                e.preventDefault(); // Prevent form submission
                item_edit_el.click(); // Trigger click event
            }
            if (e.key === 'Delete') { // Press Delete key to delete item
                e.preventDefault();
                item_delete_el.click();
            }
        });

        item_delete_el.addEventListener('click', () => {
            // Delete item from custom array without changing the order
            const index = customItemsList.findLastIndex((value, i) => {
                return value === item_input_el.value;
            });
            if (index > -1) {
                customItemsList.splice(index, 1); // Remove the item from the customItemsList array
            }
            console.log(customItemsList);

            // Add fade-out class to trigger fade-out animation
            item_el.classList.add("fade-out");

            // Remove the item from the DOM after the animation completes
            item_el.addEventListener("animationend", () => {
                elementList.removeChild(item_el);
            });

            // Save the updated todo items to localStorage
            const todoItems = Array.from(elementList.querySelectorAll(".toDo-item .text"))
                .map((inputEl) => inputEl.value);
            localStorage.setItem("toDo-items", JSON.stringify(todoItems));
        });
    }

    function swapCustomItemsList(itemText, newItemEl) {
        const currentItem = Array.from(elementList.children).find((item) => {
            const textEl = item.querySelector(".toDo-item .text");
            return textEl.value === itemText;
        });

        const newItem = newItemEl.closest(".toDo-item");

        // Swap the positions of the two items in the DOM
        elementList.insertBefore(newItem, currentItem);

        // Update the customItemsList array to reflect the new order
        const currentIndex = customItemsList.indexOf(itemText);
        const newIndex = customItemsList.indexOf(newItem.querySelector(".text").value);

        customItemsList.splice(currentIndex, 1); // Remove the current item from the array
        customItemsList.splice(newIndex, 0, itemText); // Insert the current item at the new index
        console.log(customItemsList);

        sortTodoItems(sortDropdown.textContent);
        customSortAnimation();
    }

    function sortTodoItems(sortType) {
        const todoItems = Array.from(elementList.querySelectorAll(".toDo-item .text"));

        switch (sortType) {
            case "A-Z":
                todoItems.sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()));
                break;
            case "Z-A":
                todoItems.sort((a, b) => b.value.toLowerCase().localeCompare(a.value.toLowerCase()));
                break;
            case "Custom":
                todoItems.sort((a, b) => {
                    return customItemsList.indexOf(a.value) - customItemsList.indexOf(b.value);
                });
                break;
        }
        elementList.innerHTML = "";

        todoItems.forEach((item) => {
            createTodoItem(item.value);
        });
    }

    function customSortAnimation() {
        const itemInputEls = Array.from(document.querySelectorAll(".toDo-item .text"));

        // Animate the elements to the final position
        itemInputEls.forEach((itemInputEl) => {
            const arrowUp = itemInputEl.parentNode.querySelector(".up-arrow");
            const arrowDown = itemInputEl.parentNode.querySelector(".down-arrow");

            itemInputEl.animate(
                [
                    // keyframes
                    { transform: "translateX(0px)" },
                    { transform: "translateX(15px)" },
                    { transform: "translateX(21px)" },
                    { transform: "translateX(26px)" },
                    { transform: "translateX(30px)" },
                ],
                {
                    // timing options
                    duration: 500,
                    iterations: 1,
                    fill: "forwards",
                }
            ).onfinish = () => {
                arrowUp.style.visibility = "visible";
                arrowDown.style.visibility = "visible";
            }
        });
    }

});