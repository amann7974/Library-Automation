
let body = document.querySelector("body");

const options = {
  method: "POST",
};

fetch("/pages/faculty/dashboard/verify", options)
  .then((response) => response.json())
    .then((response) => {

        if (response.error === 'Unauthorized') {
            body.innerHTML = "<h1>Unauthorized</h1>";
            window.location.href = "/pages/login/admin";
        }
        if (response.error === 'User not found') {
            body.innerHTML = "<h1>User not found</h1>";
            window.location.href = "/pages/login/admin";
        }

        if (response.error === 'Error finding user') {
            body.innerHTML = "<h1>Error finding user</h1>";
            window.location.href = "/pages/login/faculty";
        } 
    })
  .catch((err) => console.error(err));
