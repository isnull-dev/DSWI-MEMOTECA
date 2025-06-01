<?php
require 'db.php';

// Os dados virão de $_POST e $_FILES porque estamos usando FormData
$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$titulo = isset($_POST['titulo']) ? $conn->real_escape_string($_POST['titulo']) : null;
$ingredientes = isset($_POST['ingredientes']) ? $conn->real_escape_string($_POST['ingredientes']) : null;
$modo_preparo = isset($_POST['modo_preparo']) ? $conn->real_escape_string($_POST['modo_preparo']) : null;
$historia = isset($_POST['historia']) ? $conn->real_escape_string($_POST['historia']) : NULL;
$autor = isset($_POST['autor']) ? $conn->real_escape_string($_POST['autor']) : NULL;
$data_criacao = isset($_POST['data_criacao']) ? $conn->real_escape_string($_POST['data_criacao']) : date("Y-m-d");

$imagem_path_update_sql = ""; // Parte do SQL para atualizar a imagem, se houver

if ($id > 0 && $titulo !== null && $ingredientes !== null && $modo_preparo !== null) {
    // Lógica de Upload de Nova Imagem
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0775, true);
        }

        // 1. Obter o nome da imagem antiga para exclusão posterior
        $sql_old_image = "SELECT imagem_path FROM receitas WHERE id = $id";
        $result_old_image = $conn->query($sql_old_image);
        $old_imagem_path = null;
        if ($result_old_image && $result_old_image->num_rows > 0) {
            $row_old_image = $result_old_image->fetch_assoc();
            $old_imagem_path = $row_old_image['imagem_path'];
        }

        // Processar a nova imagem
        $tmp_name = $_FILES['imagem']['tmp_name'];
        $original_name = $_FILES['imagem']['name'];
        $file_extension = pathinfo($original_name, PATHINFO_EXTENSION);
        $safe_file_name = preg_replace("/[^A-Za-z0-9._-]/", "", basename($original_name, "." . $file_extension));
        $new_file_name = uniqid() . '_' . $safe_file_name . '.' . $file_extension;
        $destination = $uploadDir . $new_file_name;

        $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array(strtolower($file_extension), $allowed_types)) {
            http_response_code(400);
            echo json_encode(["message" => "Tipo de arquivo não permitido."]);
            $conn->close();
            exit;
        }
        if ($_FILES['imagem']['size'] > 5 * 1024 * 1024) { // Max 5MB
            http_response_code(400);
            echo json_encode(["message" => "Arquivo muito grande."]);
            $conn->close();
            exit;
        }

        if (move_uploaded_file($tmp_name, $destination)) {
            // Nova imagem carregada com sucesso
            $imagem_path_update_sql = ", imagem_path = '" . $conn->real_escape_string($new_file_name) . "'";

            // 2. Excluir a imagem antiga se existir
            if ($old_imagem_path && file_exists($uploadDir . $old_imagem_path)) {
                unlink($uploadDir . $old_imagem_path);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao mover o novo arquivo enviado."]);
            $conn->close();
            exit;
        }
    } elseif (isset($_POST['remover_imagem_existente']) && $_POST['remover_imagem_existente'] == 'true') {
        // Se o frontend enviar uma flag para remover a imagem sem substituir por uma nova
        // (você precisaria adicionar essa lógica no frontend se quisesse essa funcionalidade)
        // $sql_old_image = "SELECT imagem_path FROM receitas WHERE id = $id";
        // ... (código para pegar e deletar old_imagem_path) ...
        // $imagem_path_update_sql = ", imagem_path = NULL";
    }


    $sql = "UPDATE receitas SET
                titulo = '$titulo',
                ingredientes = '$ingredientes',
                modo_preparo = '$modo_preparo',
                historia = '$historia',
                autor = '$autor',
                data_criacao = '$data_criacao'
                $imagem_path_update_sql
            WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        if ($conn->affected_rows > 0 || ($imagem_path_update_sql !== "" && $conn->affected_rows >= 0) ) { // A imagem pode ter sido atualizada mesmo se outros campos não mudaram
             echo json_encode(["message" => "Receita atualizada com sucesso!"]);
        } else {
            echo json_encode(["message" => "Nenhuma alteração feita na receita ou receita não encontrada."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao atualizar receita: " . $conn->error, "sql_error" => $conn->error, "executed_sql" => $sql]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos ou ID inválido."]);
}

$conn->close();
?>