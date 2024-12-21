async function runCode() {
    const code = document.getElementById('code').value;
    const resultElement = document.getElementById('result');

    try {
        const response = await fetch('run.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const data = await response.json();
        if (data.error) {
            resultElement.textContent = `エラー: ${data.error}`;
        } else {
            resultElement.textContent = `結果:\n${data.result.output.join("\n")}`;
        }
    } catch (error) {
        resultElement.textContent = `通信エラー: ${error.message}`;
    }
}