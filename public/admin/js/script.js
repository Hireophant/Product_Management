//Button status
const buttonStatus = document.querySelectorAll("[button-status]"); //tự định nghĩa nên []
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", function () {
            const status = this.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            console.log(url.href);
            window.location.href = url.href;
        });
    });
}
//End button status

//Form Search
const formSearch = document.getElementById("form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
                url.searchParams.set("keyword", keyword);
            }
            else {
                url.searchParams.delete("keyword");
            }
            window.location.href = url.href;
    });
}

//End Form Search

//Button Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener("click", function () {
            const page = this.getAttribute("button-pagination");
            if (page) {
                url.searchParams.set("page", page);
            }
            else {
                url.searchParams.delete("page");
            }
            window.location.href = url.href;
        });
    });
}

//End Button Pagination

//Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    
    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked){
            inputsId.forEach(input => {
                input.checked = true;
            });
        }else{
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            
            if(countChecked == inputsId.length){
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}

//End Checkbox Multi

//Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        if(inputsChecked.length > 0){
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputsChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            });
            inputIds.value = ids.join(",");
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 sản phẩm")
        }
        
    })
}

//End Form Change Multi
