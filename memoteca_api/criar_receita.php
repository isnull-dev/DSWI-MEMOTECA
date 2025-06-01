<?php
require 'db.php'; // Inclui db.php que já tem os headers CORS

$titulo = isset($_POST['titulo']) ? $conn->real_escape_string($_POST['titulo']) : null;
$ingredientes = isset($_POST['ingredientes']) ? $conn->real_escape_string($_POST['ingredientes']) : null;
$modo_preparo = isset($_POST['modo_preparo']) ? $conn->real_escape_string($_POST['modo_preparo']) : null;
$historia = isset($_POST['historia']) ? $conn->real_escape_string($_POST['historia']) : NULL;
$autor = isset($_POST['autor']) ? $conn->real_escape_string($_POST['autor']) : NULL;
$data_criacao = isset($_POST['data_criacao']) ? $conn->real_escape_string($_POST['data_criacao']) : date("Y-m-d");

$imagem_path_db = NULL; // Caminho da imagem a ser salvo no banco

if (
    $titulo !== null &&
    $ingredientes !== null &&
    $modo_preparo !== null
) {
    // Lógica de Upload da Imagem
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        // Garante que o diretório de uploads exista (opcional, mas bom para robustez)
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0775, true);
        }

        $tmp_name = $_FILES['imagem']['tmp_name'];
        $original_name = $_FILES['imagem']['name'];
        $file_extension = pathinfo($original_name, PATHINFO_EXTENSION);
        $safe_file_name = preg_replace("/[^A-Za-z0-9._-]/", "", basename($original_name, "." . $file_extension)); // Remove caracteres especiais do nome base
        $new_file_name = uniqid() . '_' . $safe_file_name . '.' . $file_extension; // Gera nome único
        $destination = $uploadDir . $new_file_name;

        // Validação simples de tipo de arquivo (exemplo)
        $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array(strtolower($file_extension), $allowed_types)) {
            http_response_code(400);
            echo json_encode(["message" => "Tipo de arquivo não permitido. Apenas JPG, JPEG, PNG, GIF."]);
            $conn->close();
            exit;
        }

        // Validação de tamanho (exemplo: max 5MB)
        if ($_FILES['imagem']['size'] > 5 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(["message" => "Arquivo muito grande. Máximo de 5MB."]);
            $conn->close();
            exit;
        }

        if (move_uploaded_file($tmp_name, $destination)) {
            $imagem_path_db = $new_file_name; // Salva apenas o nome do arquivo no DB
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao mover o arquivo enviado."]);
            $conn->close();
            exit;
        }
    }

    $sql = "INSERT INTO receitas (titulo, ingredientes, modo_preparo, historia, autor, data_criacao, imagem_path)
            VALUES ('$titulo', '$ingredientes', '$modo_preparo', '$historia', '$autor', '$data_criacao', ".($imagem_path_db ? "'$imagem_path_db'" : "NULL").")";

    if ($conn->query($sql) === TRUE) {
        $last_id = $conn->insert_id;
        echo json_encode(["message" => "Nova receita criada com sucesso!", "id" => $last_id, "imagem_path" => $imagem_path_db]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao criar receita: " . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos. Título, ingredientes e modo de preparo são obrigatórios."]);
}

$conn->close();
?>