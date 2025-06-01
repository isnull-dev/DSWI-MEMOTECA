<?php
require 'db.php';

$receitas = [];
$sql = "SELECT id, titulo, ingredientes, modo_preparo, historia, autor, data_criacao, imagem_path FROM receitas ORDER BY data_criacao DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $receitas[] = $row;
    }
    echo json_encode($receitas);
} else {
    echo json_encode([]);
}

$conn->close();
?>