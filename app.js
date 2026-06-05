
// Select all the chevron icons inside your FAQ items
const icons = document.querySelectorAll('.queItem i');
const questions = document.querySelectorAll('.queItem h3');

// Loop through each icon and attach the click event
icons.forEach(icon => {
    icon.addEventListener('click', function() {
        // Find the closest parent container (.qEle) 
        const parent = this.closest('.qEle');
        
        // Find the specific paragraph (.faq-answer) inside this container
        const answer = parent.querySelector('.faqAnswer');
        
        // Toggle the 'show' class on that specific paragraph
        answer.classList.toggle('show');
        
        // OPTIONAL BONUS: Rotate the arrow when clicked
        this.style.transform = this.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
        this.style.transition = 'transform 0.5s ease';
    });
});
questions.forEach(question => {
    question.addEventListener('click', function() {
        // Find the closest parent container (.qEle) 
        const parent = this.closest('.qEle');
        
        // Find the specific paragraph (.faq-answer) inside this container
        const answer = parent.querySelector('.faqAnswer');
        
        // Toggle the 'show' class on that specific paragraph
        answer.classList.toggle('show');
        
        // --- FIX: Find ONLY the icon inside this specific parent ---
        const icon = parent.querySelector('.queItem i');
        
        // Rotate only this specific icon
        icon.style.transition = 'transform 0.5s ease';
        icon.style.transform = icon.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
        
    });
});


// capturing QR code 
// Function to start the webcam stream inside your .capture container
async function initCameraOnLoad() {
    const videoElement = document.getElementById('webcam');

    // Check if the browser supports media devices
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            // Request camera permissions instantly
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: "user" // Use "environment" if you are building a rear-facing QR scanner
                }, 
                audio: false 
            });
            
            // Assign the stream to your video element
            videoElement.srcObject = stream;
            
        } catch (error) {
            console.error("Camera access denied or unavailable:", error);
        }
    } else {
        console.error("Browser does not support getUserMedia.");
    }
}

// Automatically trigger the camera the absolute second the page load finishes
window.addEventListener('load', initCameraOnLoad);




const iBtn = document.querySelector(".iBtn").addEventListener("click", selectImage)

function selectImage() {
    // 1. Create a hidden HTML input element of type "file"
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Restrict selection to image files only

    // 2. Listen for when the user successfully selects a file
    fileInput.onchange = function (event) {
        const file = event.target.files[0]; // Get the first selected file
        console.log(file)
        
        if (file) {
            // 3. Create a URL that points to the local file
            const imageUrl = URL.createObjectURL(file);

            // 4. Create an img element and inject it into the page
            const capture = document.querySelector(".capture")
            const img = document.createElement("img");
            img.src = imageUrl;

            // Append it to your container (e.g., body or a specific div)
            capture.appendChild(img);
        }
    };

    // 3. Programmatically "click" the hidden input to open the file dialog
    fileInput.click();
}

// function selectImage() {
//             const fileInput = document.createElement("input");
//             fileInput.type = "file";
//             fileInput.accept = "image/*";

//             fileInput.onchange = function (event) {
//                 const file = event.target.files[0];
                
//                 if (file) {
//                     const imageUrl = URL.createObjectURL(file);

//                     // 1. Target our single preview container
//                     const previewBox = document.getElementById("previewBox");
                    
//                     // 2. Clear out whatever was inside it previously (Ensures only ONE image)
//                     previewBox.innerHTML = "";

//                     // 3. Create the new image and apply our styling class
//                     const img = document.createElement("img");
//                     img.src = imageUrl;
//                     img.classList.add("zoom-image");
                    
//                     // 4. Put the new image inside the container
//                     previewBox.appendChild(img);
//                 }
//             };

//             fileInput.click();
// }