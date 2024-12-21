<?php
header("Content-Type: application/json; charset=UTF-8");

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$code = $data['code'] ?? '';
if (empty($code)) {
    echo json_encode(["error" => "コードが空です"]);
    exit;
}

// DNCLの簡易エンジン（仮の例）
function parseDNCL($lines) {
    $variables = [];
    $output = [];
    foreach ($lines as $line) {
        $line = trim($line);
        if (preg_match('/^(\w+)\s*←\s*(.+)$/', $line, $matches)) {
            $variables[$matches[1]] = evalExpression($matches[2], $variables);
        } elseif (preg_match('/(.+)を表示する/', $line, $matches)) {
            $output[] = evalExpression($matches[1], $variables);
        }
    }
    return ["variables" => $variables, "output" => $output];
}

function evalExpression($expression, $variables) {
    foreach ($variables as $key => $value) {
        $expression = str_replace($key, $value, $expression);
    }
    return eval('return ' . $expression . ';');
}

$lines = explode("\n", $code);
$result = parseDNCL($lines);
echo json_encode(["result" => $result]);
?>