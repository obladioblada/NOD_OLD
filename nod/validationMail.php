<?php
$errors = array();
$data = array();
// Getting posted data and decodeing json
$_POST = json_decode(file_get_contents('php://input'), true);

// checking for blank values.
if (empty($_POST['pwd']))
  $errors['name'] = 'pwd is required.';

if (empty($_POST['username']))
  $errors['username'] = 'Username is required.';

if (empty($_POST['email']))
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

// send email
mail($_POST['pwd'],"NOD",$msg);
// response back.

echo json_encode($data);
?>