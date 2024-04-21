// script.js
document.getElementById('colorForm').addEventListener('submit', function (event) {
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
}
function randomColor() {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomHex.padStart(6, '0');
}

document.getElementById('addColor').addEventListener('click', function () {
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
        input.addEventListener('input', showColorCombinations);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = 'Remove';
        deleteButton.onclick = function () {
            inputWrapper.remove(); // Remove the entire wrapper div
            updateIds(); // Update IDs of all inputs and buttons after removal
            showColorCombinations();
        };

        inputWrapper.appendChild(input);
        inputWrapper.appendChild(deleteButton);
        colorInputs.appendChild(inputWrapper);
    } else {
        alert('Maximum of 20 colors reached');
    }
    showColorCombinations();
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
    document.getElementById('addColor').style.display = 'block'; // Show the Add Color button
    document.getElementById('copyPalette').style.display = 'block'; // Show the Add Color button
    showColorCombinations();
}
function showColorCombinations() {
    const colors = [];
    const inputs = document.querySelectorAll('#colorInputs input[type=color]');
    inputs.forEach(input => colors.push(input.value));

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
            const rgb1 = hexToRgb(colors[i]);
            const rgb2 = hexToRgb(colors[j]);
            const lum1 = calculateLuminance(rgb1);
            const lum2 = calculateLuminance(rgb2);
            const contrastRatio = calculateContrastRatio(lum1, lum2);
            const colorDiff = calculateColorDifference(rgb1, rgb2);
            const readabilityScore = calculateReadabilityScore(contrastRatio, colorDiff);
            
            combinations.push({
                backgroundColor: colors[i],
                textColor: colors[j],
                readability: Math.round(readabilityScore/1.9,2)
            });
        }
    }

    // Sort combinations by contrast ratio in descending order
    combinations.sort((a, b) => b.readability - a.readability);

    // Create and append sorted combinations to the DOM
    combinations.forEach(combo => {
        const comboElement = document.createElement('div');
        comboElement.className = 'combination';
        comboElement.style.backgroundColor = combo.backgroundColor;
        comboElement.style.color = combo.textColor;
        console.log(combo.readability);
        comboElement.innerHTML = `Background: ${combo.backgroundColor} <br> Text: ${combo.textColor} <br> Readability: ${combo.readability}`;
        combinationsContainer.appendChild(comboElement);
    });
}

document.getElementById('copyPalette').addEventListener('click', function () {
    const colorInputs = document.querySelectorAll('#colorInputs input[type=color]');
    const colorValues = Array.from(colorInputs).map(input => input.value);
    const colorString = colorValues.join(' '); // Joins all colors into a single string separated by spaces

    navigator.clipboard.writeText(colorString).then(() => {
        alert('Palette copied to clipboard: ' + colorString);
    }).catch(err => {
        console.error('Failed to copy colors: ', err);
        alert('Failed to copy palette.');
    });
});

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    // handle shorthand (3 digit) hex code
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // handle full (6 digit) hex code
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return { r, g, b };
}

function calculateLuminance(rgb) {
    // sRGB luminance calculation
    const a = [rgb.r, rgb.g, rgb.b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrastRatio(lum1, lum2) {
    const lumMax = Math.max(lum1, lum2);
    const lumMin = Math.min(lum1, lum2);
    return (lumMax + 0.05) / (lumMin + 0.05);
}

function calculateColorDifference(rgb1, rgb2) {
    // Calculate Euclidean distance between two colors
    const dr = rgb1.r - rgb2.r;
    const dg = rgb1.g - rgb2.g;
    const db = rgb1.b - rgb2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

function calculateReadabilityScore(contrastRatio, colorDiff) {
    // Normalize color difference
    const normalizedColorDiff = colorDiff / 441.6729559300637;  // Maximum color difference (black vs white in RGB space)
    const contrastWeight = 0.9;
    const colorDiffWeight = 0.1;

    // Calculate the weighted score
    const readabilityScore = (contrastRatio * contrastWeight) + (normalizedColorDiff * colorDiffWeight);
    return readabilityScore;
}
