<?php
$sendTo = "contact@factor13.net";
$subject = $_POST["subject"];

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= "From: factor13.net <" . $_POST["email"] . ">\r\n";
$headers .= "Reply-To: " . $_POST["email"] . "\r\n";
$headers .= "Return-path: " . $_POST["email"];

$message = $_POST["junk"];

mail($sendTo, $subject, $message, $headers);

?>