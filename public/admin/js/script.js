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