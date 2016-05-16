<?php
$errors = array();
$data = array();
// Getting posted data and decodeing json
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$email = $request->email;
    @$pwd = $request->pwd;
    @$username = $request->username;


// checking for blank values.
if (empty(@$pwd))
  $errors['pwd'] = 'pwd is required.';

if (empty(@$username))
  $errors['username'] = 'Username is required.';

if (empty(@$email))
  $errors['email'] = 'Email is required.';

if (!empty($errors)) {
  $data['errors']  = $errors;
} else {
  $data['message'] = 'Form data is going well';
}

// the message
$msg = "NOD validation";

// use wordwrap() if lines are longer than 70 characters
$msg = wordwrap($msg,70);


	$from_add = "no-reply@nodmusic.com";

	$to_add = @$email; //<-- put your yahoo/gmail email address here

	$subject = "Test Subject";
	$message = $msg;

	$headers = "From: $from_add \r\n";
	$headers .= "Reply-To: $from_add \r\n";
	$headers .= "Return-Path: $from_add\r\n";
	$headers .= "X-Mailer: PHP \r\n";
	$header.= "MIME-Version: 1.0\r\n";
    $header.= "Content-Type: text/plain; charset=utf-8\r\n";
    $header.= "X-Priority: 1\r\n";


	if(mail($to_add,$subject,$message,$headers))
	{
		$data['message'] = " Mail sent OK";
	}
	else
	{
 	   $data['message'] = " Error sending email!";
	}

// response back.

echo json_encode($data);
?>