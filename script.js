// script.js
document.getElementById('colorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const colorCount = document.getElementById('colorCount').value;
    generateColorInputs(colorCount);
});

function generateColorInputs(count) {
    const colorInputs = document.getElementById('colorInputs');
    colorInputs.innerHTML = ''; // Clear previous inputs
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'color';
        input.id = 'color' + i;
        input.value = randomColor(); // Set a random color
        colorInputs.appendChild(input);
    }
    document.getElementById('showCombinations').style.display = 'block';
}

function randomColor() {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomHex.padStart(6, '0');
}

document.getElementById('addColor').addEventListener('click', function() {
    addColorInput();
});

function addColorInput() {
    const colorInputs = document.getElementById('colorInputs');
    const existingInputs = colorInputs.querySelectorAll('input[type=color]');
    if (existingInputs.length < 20) {
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'color-input-wrapper';

        const input = document.createElement('input');
        input.type = 'color';
        input.id = 'color' + existingInputs.length;
        input.value = randomColor();

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = 'Remove';
        deleteButton.onclick = function() {
            inputWrapper.remove(); // Remove the entire wrapper div
            updateIds(); // Update IDs of all inputs and buttons after removal
        };

        inputWrapper.appendChild(input);
        inputWrapper.appendChild(deleteButton);
        colorInputs.appendChild(inputWrapper);
    } else {
        alert('Maximum of 20 colors reached');
    }
}

function updateIds() {
    const colorInputs = document.querySelectorAll('.color-input-wrapper input[type=color]');
    colorInputs.forEach((input, index) => {
        input.id = 'color' + index; // Update the ID based on the current index
    });
}



function generateColorInputs(count) {
    const colorInputs = document.getElementById('colorInputs');
    colorInputs.innerHTML = ''; // Clear previous inputs
    for (let i = 0; i < count; i++) {
        addColorInput(); // Reuse the new function to add color inputs
    }
    document.getElementById('showCombinations').style.display = 'block';
    document.getElementById('addColor').style.display = 'block'; // Show the Add Color button
}


document.getElementById('showCombinations').addEventListener('click', function() {
    const colors = [];
    const inputs = document.querySelectorAll('#colorInputs input[type=color]');
    inputs.forEach(input => colors.push(input.value));
    showColorCombinations(colors);
});

function showColorCombinations(colors) {
    const combinationsContainer = document.getElementById('combinationsContainer');
    combinationsContainer.innerHTML = ''; // Clear previous combinations

    let combinations = [];

    // Generate all combinations and push them into an array
    for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < colors.length; j++) {
            if (colors[i] === colors[j]) {
                // Skip if background color and text color are the same
                continue;
            }
            const contrastRatio = getContrastRatio(colors[i], colors[j]);
            combinations.push({
                backgroundColor: colors[i],
                textColor: colors[j],
                contrast: contrastRatio
            });
        }
    }

    // Sort combinations by contrast ratio in descending order
    combinations.sort((a, b) => b.contrast - a.contrast);

    // Create and append sorted combinations to the DOM
    combinations.forEach(combo => {
        const comboElement = document.createElement('div');
        comboElement.className = 'combination';
        comboElement.style.backgroundColor = combo.backgroundColor;
        comboElement.style.color = combo.textColor;
        comboElement.innerHTML = `Background: ${combo.backgroundColor} <br> Text: ${combo.textColor} <br> Contrast Ratio: ${combo.contrast}`;
        combinationsContainer.appendChild(comboElement);
    });
}



function getContrastRatio(color1, color2) {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    const ratio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
    return Math.round(100*(ratio/21),0); // Keep two decimals for readability
}

function getLuminance(hex) {
    const rgb = hexToRgb(hex);
    const a = [rgb.r, rgb.g, rgb.b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow(((v + 0.055) / 1.055), 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length == 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length == 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return {r, g, b};
}
