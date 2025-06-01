<?php
require 'db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    $uploadDir = 'uploads/';

    // 1. Obter o nome da imagem para exclusão
    $sql_get_image = "SELECT imagem_path FROM receitas WHERE id = $id";
    $result_image = $conn->query($sql_get_image);
    $imagem_path_to_delete = null;

    if ($result_image && $result_image->num_rows > 0) {
        $row = $result_image->fetch_assoc();
        $imagem_path_to_delete = $row['imagem_path'];
    }

    // 2. Excluir o registro do banco
    $sql_delete_receita = "DELETE FROM receitas WHERE id = $id";

    if ($conn->query($sql_delete_receita) === TRUE) {
        if ($conn->affected_rows > 0) {
            // 3. Se o registro foi excluído e existia uma imagem, excluí-la do servidor
            if ($imagem_path_to_delete && file_exists($uploadDir . $imagem_path_to_delete)) {
                unlink($uploadDir . $imagem_path_to_delete);
            }
            echo json_encode(["message" => "Receita excluída com sucesso!"]);
        } else {
            http_response_code(404); // Já foi excluída ou não existe
            echo json_encode(["message" => "Receita não encontrada ou já excluída."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao excluir receita: " . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ID inválido."]);
}

$conn->close();
?>