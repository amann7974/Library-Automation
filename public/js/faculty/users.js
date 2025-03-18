const isLoggedInOptions = {
  method: "POST",
};

fetch("/api/loggedInUser", isLoggedInOptions)
  .then((response) => response.json())
  .then((response) => {
    let userProfilePic = document.querySelector("#userProfilePic");
    let userFullName = document.querySelector("#userFullName");
    let wname = document.querySelector("#wname");

    console.log(response);

    if (response.success) {
      userProfilePic.src = `https://ui-avatars.com/api/?name=${response.user.name}`;
        userFullName.innerHTML = response.user.name;
        wname.innerHTML = response.user.name.split(" ")[0];
    }
  })
  .catch((err) => console.error(err));
