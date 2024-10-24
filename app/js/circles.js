function createCanvasWithCircles() {
    // VGA size (640x480)
    const width = 640;
    const height = 480;

    // Create the canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // Get the drawing context
    const ctx = canvas.getContext('2d');

    // Function to generate a random color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Draw 3 random circles
    for (let i = 0; i < 3; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 50 + 20; // Random radius between 20 and 70
        const color = getRandomColor();

        // Draw the circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Append the canvas to the div with id 'centraldiv'
    const centralDiv = document.getElementById('mainDiv');
    if (centralDiv) {
        centralDiv.appendChild(canvas);
    } else {
        console.error('Element with id "mainDiv" not found.');
    }
}

// Call the function to create the canvas and draw the circles
createCanvasWithCircles();
