const urlBase = 'http://fourthreethreeone.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

// To enforce required fields
function validate() {
	'use strict'
  
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll('.needs-validation')
  
	// Loop over them and prevent submission
	Array.from(forms)
	  .forEach(function (form) {
		form.addEventListener('submit', function (event) {
		  if (!form.checkValidity()) {
			event.preventDefault()
			event.stopPropagation()
		  }
  
		  form.classList.add('was-validated')
		}, false)
	  })
  }

  function registerNewUser()
{
	let newFirstName = document.getElementById("newFirstName").value;
	let newLastName = document.getElementById("newLastName").value;
	let newLogin = document.getElementById("newLogin").value;
	let newPassword = document.getElementById("newPassword").value;
	document.getElementById("registerResult").innerHTML = "";

  // Prevent empty credentials from being entered
  if (newLogin == "" || newPassword == "" || newFirstName == "" || newLastName == "")
  {
    document.getElementById("registerResult").innerHTML = "Error, one or more fields are empty.";
    return;
  }

	let tmp = {
		firstName:newFirstName,
		lastName:newLastName,
		login:newLogin,
		password:newPassword
	};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/RegisterNewUser.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
        let jsonObject = JSON.parse( xhr.responseText );

        const errorString = "User already exists";
        let result = errorString.localeCompare(jsonObject.error);

        if (result == 1) 
        {
          document.getElementById("registerResult").innerHTML = "User already exists";
          return;
        }

        // I'm not sure how to make this play nice with the required field process
				document.getElementById("registerResult").innerHTML = "New User has been registered!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function searchContacts()
{
	readCookie();

	let srch = document.getElementById("searchText").value;
	document.getElementById("accordionExample").innerHTML = "";
	
	let contactsList = "";

	let tmp = {userId:userId, search:srch};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );				

				let j = 0;

				for( let i=0; i<jsonObject.results.length; i++ )
				{   
			/*		
					contactsList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactsList += "<br />\r\n";
					}
			*/	
					j = i+1;

					var div = document.createElement("div");
   					div.innerHTML = 
   					"<div class='accordion-item'>" +
    					"<h2 class='accordion-header' id='heading" + j + "'>"+
    					  	"<button class='accordion-button' type='button' data-bs-toggle='collapse' data-bs-target='#collapse" + j + "' aria-expanded='false' aria-controls='collapse" + j + "'>"+
        						jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName+
      						"</button>"+
    					"</h2>"+
   						"<div id='collapse" + j + "' class='accordion-collapse collapse show' aria-labelledby='heading" + j + "' data-bs-parent='#accordionExample'>"+
      						"<div class='accordion-body' style='font-size:15px; background-color: #eee;'>"+
        						jsonObject.results[i].Phone + " " + jsonObject.results[i].Email +
        						"&nbsp&nbsp&nbsp<button type='button' class='editbutton'> Edit </button>"+
        						"&nbsp&nbsp&nbsp<button type='button' class='deletebutton'> Delete </button>"+
     						"</div>"+
    					"</div>"+
  					"</div>";
    				document.getElementById("accordionExample").appendChild(div);
					
				}

				///document.getElementsByTagName("p")[0].innerHTML = contactsList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResults").innerHTML = err.message;
		window.alert("error catch");
	}

}