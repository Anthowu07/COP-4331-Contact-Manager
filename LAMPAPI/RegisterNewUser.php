<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    $login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$checkIfExists_stmt = $conn->prepare("SELECT Login,Password FROM Users WHERE Login=?");
        $checkIfExists_stmt->bind_param("s", $login);
		$checkIfExists_stmt->execute();
		$result = $checkIfExists_stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
			returnWithError("User already exists");
		}
		else
		{
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
		    $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
		    $stmt->execute();
            //returnWithError("User registered");
            returnWithInfo( $firstName, $lastName, $login, $password );
            $stmt->close();
		}
        $checkIfExists_stmt->close();
		$conn->close();
        
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithInfo( $firstName, $lastName, $login, $password )
	{
		$retValue = '{"firstName":"' . $firstName . '",
                        "lastName":"' . $lastName . '",
                        "login":"' . $login . '",
                        "password":"' . $password . '",
                        "error":"New User has been registered!"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>