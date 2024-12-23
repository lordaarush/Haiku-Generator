async function generateHaiku() {
    const display = document.getElementById('haiku-display');
    const input = document.getElementById('theme-input');
    const theme = input.value.trim();

    if (!theme) {
        display.innerHTML = '<p style="color: red;">Please enter a theme.</p>';
        return;
    }

    // Show loading message
    display.innerHTML = "<p>Generating haiku...</p>";

    try {
        const response = await fetch('/generate_haiku', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ theme })
        });

        const data = await response.json();
        if (data.haiku) {
            // Split the generated haiku into lines (if it's a string, split it by newline or space)
            const lines = data.haiku.split("\n");  // Ensure haiku is split by newlines or any other delimiter used

            display.innerHTML = `
                <div class="scroll">
                    <div class="haiku-text"></div>
                </div>
            `;
            const haikuText = display.querySelector('.haiku-text');
            
            lines.forEach((line, index) => {
                const lineElement = document.createElement('div');
                lineElement.className = 'haiku-line';
                lineElement.textContent = line;
                haikuText.appendChild(lineElement);

                setTimeout(() => {
                    lineElement.classList.add('visible');
                }, 300 * (index + 1)); // Adjust the delay to animate each line
            });
        } else if (data.error) {
            display.innerHTML = `<p style="color: red;">${data.error}</p>`;
        } else {
            display.innerHTML = '<p style="color: red;">Failed to generate haiku. Please try again.</p>';
        }
    } catch (error) {
        display.innerHTML = '<p style="color: red;">Error generating haiku. Please try again later.</p>';
    }
}