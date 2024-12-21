const textarea = document.getElementById("code");
const lineNumbers = document.getElementById("line-numbers");

// 行番号の更新
textarea.addEventListener("input", updateLineNumbers);
textarea.addEventListener("scroll", syncScroll);

function updateLineNumbers() {
    const lines = textarea.value.split("\n").length;
    lineNumbers.innerHTML = "";
    for (let i = 1; i <= lines; i++) {
        const div = document.createElement("div");
        div.textContent = i;
        lineNumbers.appendChild(div);
    }
}

function syncScroll() {
    lineNumbers.scrollTop = textarea.scrollTop;
}

// 実行ボタンの処理
async function runCode() {
    const code = textarea.value;
    const resultElement = document.getElementById("result");
    const errorsElement = document.getElementById("errors");

    try {
        const response = await fetch('/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const data = await response.json();

        // エラー表示
        if (data.errors && data.errors.length > 0) {
            errorsElement.textContent = `エラー:\n${data.errors.join("\n")}`;
        } else {
            errorsElement.textContent = "エラーはありません";
        }

        // 出力表示
        if (data.output && data.output.length > 0) {
            resultElement.textContent = `結果:\n${data.output.join("\n")}`;
        } else {
            resultElement.textContent = "結果はありません";
        }
    } catch (error) {
        errorsElement.textContent = `通信エラー: ${error.message}`;
    }
}

// サンプルコードのロード
function loadSample() {
    textarea.value = `x ← 10\ny ← 20\nもし x > y ならば\n    x を表示する\nそうでなければ\n    y を表示する`;
    updateLineNumbers();
}
