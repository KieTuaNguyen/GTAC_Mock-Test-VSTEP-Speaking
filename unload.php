<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['audio']) && !empty($_POST['name'])) {
  $name = $_POST['name'];
  $tmp_name = $_FILES['audio']['tmp_name'];
  $target_dir = 'data/';
  $target_file = $target_dir . $name . '.wav';
  move_uploaded_file($tmp_name, $target_file);
}
?>