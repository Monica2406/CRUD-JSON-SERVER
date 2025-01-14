const myForm = document.getElementById("myForm");
const user = document.getElementById("name");
const email = document.getElementById("email");
const result = document.querySelector("#result");

let users = [];

// read users data
const URL = "http://localhost:3000";

let editable = false;
let userId = "";

// Generate Random Id
const getRandomId = () => {
  let randomId = Math.floor(Math.random() * 1000);
  console.log(randomId);
  return randomId;
};

// Create User Data
function createUser(user) {
  //console.log("user Parameter =", user);
  let extItem = users.find((item) => item.email === user.email);
  //console.log("extItem =", extItem);

  if (extItem) {
    alert("User is already registered, Email exists.");
  } else {
    fetch(`${URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        alert("user created successfully");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
}


// Submit Form
myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (editable === false) {
    // Create New User
    let id = String(getRandomId());
    const data = {
      id,
      name: user.value,
      email: email.value,
    };
    console.table(data);
    createUser(data);
  } else {
    // update existing user
    const data = {
      name: user.value,
      email: email.value,
    };
    updateUser(data, userId);
  }
});

// Get All Users
const getUsers = async () => {
  await fetch(`${URL}/register`, {
    method: "GET",
  })
    .then((out) => out.json())
    .then((res) => {
      console.table(res);
      printInTable(res);
    })
    .catch();
};

// Self Invoke Function
(function () {
  getUsers();
})();

// Printing in Table
function printInTable(user) {
  console.log("Printing", user);

  user.forEach((item) => {
    let tr = document.createElement("tr");
    let id = document.createElement("td");
    let name = document.createElement("td");
    let email = document.createElement("td");
    let action = document.createElement("td");

    id.textContent = item.id;
    name.textContent = item.name;
    email.textContent = item.email;
    action.innerHTML = `<button class= 'edit' onclick='edit(this)' >Edit</button>
                        <button class='delete' onclick='deleteUser(${item.id})'>Delete</button>`;

    tr.appendChild(id);
    tr.appendChild(name);
    tr.appendChild(email);
    tr.appendChild(action);
    result.appendChild(tr);
  });
}
//Edit user
function edit(e) {
    /* console.log("Edit",e);
    console.log("Edit",typeof e); */

    editable = true;

    let selUser = e.parentElement.parentElement;
    /*console.log(selUser);
    console.log(selUser.children[0].innerHTML); */

    userId = selUser.children[0].innerHTML;//value taking from first child element of tr
    
    user.value = selUser.children[1].innerHTML;
    email.value = selUser.children[2].innerHTML
}

//update user
const updateUser = async (data, id) => {
  console.log("update Data = ", data);
  console.log("update ID = ", id);
  await fetch(`${URL}/register/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      alert("User Updated Successfully");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    })
    .catch((error) => { 
      console.log(error.message);
    });
};
//DELETE USER
function deleteUser(id) {
  console.log("Delete ID= ", id);
  if (confirm(`Are you sure to delete user ID = ${id}`)) { 
    fetch(`${URL}/register/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        alert("User Deleted Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        console.log(error.message);
      });
  } else {
    alert("User is not deleted");
  } 
}

