<?php
require 'db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    $sql = "SELECT id, titulo, ingredientes, modo_preparo, historia, autor, data_criacao, imagem_path FROM receitas WHERE id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Receita não encontrada."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ID inválido."]);
}

$conn->close();
?>