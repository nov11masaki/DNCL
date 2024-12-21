from flask import Flask, request, jsonify

app = Flask(__name__)

def debug_and_execute_dncl(lines):
    variables = {}
    output = []
    errors = []

    for line_number, line in enumerate(lines):
        line = line.strip()
        try:
            # 変数代入
            if "←" in line:
                var_name, value = line.split("←")
                var_name = var_name.strip()
                value = eval_expression(value.strip(), variables)
                variables[var_name] = value
            # 条件分岐
            elif line.startswith("もし"):
                condition = line[2:].split("ならば")[0].strip()
                if not eval_expression(condition, variables):
                    raise ValueError(f"条件式エラー: '{condition}' は不正です")
            # 表示処理
            elif "を表示する" in line:
                value = line.split("を表示する")[0].strip()
                output.append(eval_expression(value, variables))
            else:
                raise ValueError(f"構文エラー: '{line}' は認識されません")
        except Exception as e:
            errors.append(f"行 {line_number + 1}: {e}")

    return {"output": output, "errors": errors}

def eval_expression(expression, variables):
    # 変数を値に置き換える
    for var_name, value in variables.items():
        expression = expression.replace(var_name, str(value))
    try:
        # 式を評価
        return eval(expression)
    except Exception:
        raise ValueError(f"式エラー: '{expression}' を評価できません")

@app.route('/run', methods=['POST'])
def run():
    data = request.json
    code = data.get('code', '')
    if not code:
        return jsonify({"output": [], "errors": ["コードが空です"]})
    
    lines = code.split('\n')
    result = debug_and_execute_dncl(lines)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
