const urlBase = "http://fourthreethreeone.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;
  //	var hash = md5( password );

  document.getElementById("loginResult").inneorHTML = "";

  let tmp = { login: login, password: password };
  //	var tmp = {login:login,password:hash};
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/Login." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "contacts.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML =
      "Logged in as " + firstName + " " + lastName;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

// // To enforce required fields
// function validate() {
//   "use strict";

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   var forms = document.querySelectorAll(".needs-validation");

//   // Loop over them and prevent submission
//   Array.from(forms).forEach(function (form) {
//     form.addEventListener(
//       "submit",
//       function (event) {
//         if (!form.checkValidity()) {
//           event.preventDefault();
//           event.stopPropagation();
//         }

//         form.classList.add("was-validated");
//       },
//       false
//     );
//   });
// }

function registerNewUser() {
  let newFirstName = document.getElementById("newFirstName").value;
  let newLastName = document.getElementById("newLastName").value;
  let newLogin = document.getElementById("newLogin").value;
  let newPassword = document.getElementById("newPassword").value;
  document.getElementById("registerResult").innerHTML = "";

  // Prevent empty/invalid credentials from being entered
  if (
    newLogin == "" ||
    newPassword == "" ||
    newFirstName == "" ||
    newLastName == ""
  ) {
    document.getElementById("registerResult").innerHTML =
      "Error, one or more fields are empty";
    return;
  } else {
    var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,}/;

    if (regex.test(newPassword) == false) {
      document.getElementById("registerResult").innerHTML =
        "Error, password does not fulfill the requirements";
      return;
    }
  }

  let tmp = {
    firstName: newFirstName,
    lastName: newLastName,
    login: newLogin,
    password: newPassword,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/RegisterNewUser." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);

        document.getElementById("registerResult").innerHTML = jsonObject.error;
        return;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("registerResult").innerHTML = err.message;
  }
}

function searchContacts() {
  readCookie();

  let srch = document.getElementById("searchText").value;
  document.getElementById("accordionExample").innerHTML = "";
  document.getElementById("editContact").innerHTML = "";

  let contactsList = "";

  let tmp = { userId: userId, search: srch };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/SearchContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);

        let j = 0;
        for (let i = 0; i < jsonObject.results.length; i++) {
          /*		
					contactsList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactsList += "<br />\r\n";
					}
			*/
          j = i + 1;

          var div = document.createElement("div");
          div.innerHTML =
            "<div class='accordion-item'>" +
            "<h2 class='accordion-header' id='heading" + j +"'>" +
            "<button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse" + j +
            "' aria-expanded='false' aria-controls='collapse" + j + "'>" +
            "<span id = listFname" +i +">" +jsonObject.results[i].FirstName +"</span> " +
            "<p> &nbsp</p>" +
            "<span id = listLname" + i + ">" +jsonObject.results[i].LastName +"</span> " +
            "</button>" +
            "</h2>" +
            "<div id='collapse" + j +"' class='accordion-collapse collapse' aria-labelledby='heading" +
            j +
            "' data-bs-parent='#accordionExample'>" +
            "<div class='accordion-body' style='font-size:15px; background-color: #eee;'>" +
            "<span id = listPhone" +
            i +
            ">" +
            jsonObject.results[i].Phone +
            "</span> " +
            " " +
            "<span id = listEmail" +
            i +
            ">" +
            jsonObject.results[i].Email +
            "</span> " +
            "&nbsp&nbsp&nbsp<button type='button' class='editbutton' onclick='editContact(" +
            jsonObject.results[i].ID +
            "," +
            i +
            ");'> Edit </button>" +
            "&nbsp&nbsp&nbsp<button type='button' class='deletebutton' onclick='deleteContact(" +
            jsonObject.results[i].ID +
            ");'> Delete </button>" +
            "</div>" +
            "</div>" +
            "</div>";
          document.getElementById("accordionExample").appendChild(div);
        }
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("searchResults").innerHTML = err.message;
  }
}

function addContact() {
  readCookie();

  let fname = document.getElementById("FnameInput").value;
  let lname = document.getElementById("LnameInput").value;
  let contactemail = document.getElementById("EmailInput").value;
  let contactphone = document.getElementById("NumberInput").value;
	
  // Verifies that the information is valid format
  if (
    fname == "" ||
    lname == "" ||
    contactemail == "" ||
    contactphone == ""
  ) {
    document.getElementById("contactAddResult").innerHTML =
          "Error, one or more fields are empty";
          return;
  }

  if (!(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(contactphone)))
  {
    document.getElementById("contactAddResult").innerHTML =
          "Error, phone number is not a valid format";
          return;
  }

  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(contactemail)))
  {
    document.getElementById("contactAddResult").innerHTML =
          "Error, email is not a valid format";
          return;
  }

  let tmp = {
    firstName: fname,
    lastName: lname,
    email: contactemail,
    phone: contactphone,
    userId: userId,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/AddContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactAddResult").innerHTML =
          "Contact has been added";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }

  //Clear fields once contact has been added
  var allInputs = document.querySelectorAll("input");
  allInputs.forEach((singleInput) => (singleInput.value = ""));
  xhr.onload = function () {
    searchContacts();
  };
}

function editContact(contactID, placeOnPage) {
  document.getElementById("editContact").innerHTML = "";

  var div = document.createElement("div");
  div.innerHTML =
    "<h2> Edit Menu </h2>" +
    "<div class='row'>" +
    "<div class = 'col-sm-6'>" +
    "<input type='text' id='editFNameInput' value='" +
    document.getElementById("listFname" + placeOnPage).textContent +
    "'>" +
    "</div>" +
    "<div class = 'col-sm-6'>" +
    "<input type='text' id='editLNameInput' value='" +
    document.getElementById("listLname" + placeOnPage).textContent +
    "'>" +
    "</div>" +
    "</div>" +
    "<div class='row'>" +
    "<div class = 'col-sm-6'>" +
    "<input type='text' id='editEmailInput' value='" +
    document.getElementById("listEmail" + placeOnPage).textContent +
    "'>" +
    "</div>" +
    "<div class = 'col-sm-4'>" +
    "<input type='text' id='editPhoneInput' value='" +
    document.getElementById("listPhone" + placeOnPage).textContent +
    "'>" +
    "</div>" +
    "<div class='col-sm-2'>" +
    "<button type='button' id='saveButton' class='buttons' onclick='saveEdit(" +
    contactID +
    ");'> Save</button>" +
    "</div>" +
    "</div>" +
    "<br />";
  document.getElementById("editContact").appendChild(div);
  xhr.onload = function () {
    searchContacts();
  };
}

function saveEdit(contactID) {
  userId = 0;

  readCookie();

  let fname = document.getElementById("editFNameInput").value;
  let lname = document.getElementById("editLNameInput").value;
  let contactemail = document.getElementById("editEmailInput").value;
  let contactphone = document.getElementById("editPhoneInput").value;
	
  // Verifies that the information is valid format
  if (
    fname == "" ||
    lname == "" ||
    contactemail == "" ||
    contactphone == ""
  ) {
    document.getElementById("contactAddResult").innerHTML =
          "Error, one or more fields are empty";
          return;
  }

  if (!(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(contactphone)))
  {
    document.getElementById("contactAddResult").innerHTML =
          "Error, phone number is not a valid format";
          return;
  }

  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(contactemail)))
  {
    document.getElementById("contactAddResult").innerHTML =
          "Error, email is not a valid format";
          return;
  }

  let tmp = {
    firstName: fname,
    lastName: lname,
    email: contactemail,
    phone: contactphone,
    userId: userId,
    id: contactID,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/EditContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("editContact").innerHTML = err.message;
  }

  document.getElementById("editContact").innerHTML = "";

  xhr.onload = function () {
    searchContacts();
  };
}

function deleteContact(contactID) {

  if (confirm("Are you sure you want to delete this contact?") == false)
  {
    return;
  }
  userId = 0;
  readCookie();

  let tmp = {
    userId: userId,
    id: contactID,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/DeleteContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("editContact").innerHTML = err.message;
  }

  document.getElementById("editContact").innerHTML = "";

  xhr.onload = function () {
    searchContacts();
  };
}
