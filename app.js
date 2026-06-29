
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

const videoElement = document.getElementById('webcam');

async function initCameraOnLoad() {

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
            

        function scanQRCode() {
        // Check if the video is ready and playing
            if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
                // Match canvas dimensions to the video frame
                canvasElement.height = videoElement.videoHeight;
                canvasElement.width = videoElement.videoWidth;

                // Draw the current video frame onto the hidden canvas
                canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

                // Extract the pixel image data from the canvas
                const imageData = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height);

                // Use jsQR to locate and decode a QR code within the pixel data
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    // QR code detected! Handle the result here
                    outputSpan.innerText = code.data;
                    outputSpan.style.color = "green";
                    
                    // Optional: stop scanning or take an action (like redirecting)
                    console.log("Found QR code:", code.data);
                }

            }
        }
       // Continuously call this function to process the next incoming camera frames
        requestAnimationFrame(scanQRCode);
        
        } catch (error) {
            console.error("Camera access denied or unavailable:", error);
        }
    } else {
        console.error("Browser does not support getUserMedia.");
    }
}

// Function to turn OFF the camera
function stopCamera() {
    if (videoElement && videoElement.srcObject) {
        
        // 1. Get the active MediaStream from the video element's srcObject
        const stream = videoElement.srcObject;

        // 2. Get all active video/audio tracks FROM THE STREAM
        const tracks = stream.getTracks();

        // 3. Loop through them and shut down the hardware connection
        tracks.forEach(track => track.stop());

        // 4. Completely clear the video element source
        videoElement.srcObject = null;
        
        console.log("Camera successfully stopped.");
    } else {
        console.log("No active camera stream found to stop.");
    }
}



// Automatically trigger the camera the absolute second the page load finishes
const startCamBtn = document.querySelector(".startCamBtn");
const stopCamBtn = document.querySelector(".stopCamBtn");

const imageBtn = document.querySelector(".imageBtn");
//.addEventListener("click", selectImage)

startCamBtn.addEventListener('click', initCameraOnLoad);
stopCamBtn.addEventListener('click', stopCamera);


try {
    function selectImage() {
        // 1. Create a hidden HTML input element of type "file"
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*"; // Restrict selection to image files only

        // 2. Listen for when the user successfully selects a file
        fileInput.onchange = function (event) {
            const file = event.target.files[0]; // Get the first selected file
            
            if (file) {
                // --- VISUAL PREVIEW LOGIC ---
                const imageUrl = URL.createObjectURL(file);
                const previewBox = document.querySelector(".previewBox");
                previewBox.innerHTML = ``; // Clear previous container contents
                
                const previewImg = document.createElement("img");
                previewImg.src = imageUrl;
                
                previewBox.appendChild(previewImg);
                previewBox.classList.add("previewBox");
                //imageBtn.style.display = "none"; // Hide button after selection

                // --- DECODING LOGIC (The Missing Link Fix) ---
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        // Create an off-screen canvas
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Scale management: Helps keep heavy phone camera pixels optimized
                        const MAX_WIDTH = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > MAX_WIDTH) {
                            height = Math.round((height * MAX_WIDTH) / width);
                            width = MAX_WIDTH;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        
                        // Draw image onto the canvas
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Extract the image pixel data
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        console.log(imageData)
                        // Pass the data to the jsQR decoder
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        
                        if (code) {
                            console.log("Decoded Data:", code.data);
                            // Call your result handler function here! 
                            // e.g., displayResult(code.data);
                        } else {
                            //alert("No QR code found in this image. Try a clearer picture!");
                            //window.body.appendChild("")
                             //alert("Select a Network");
                            const modal = document.createElement('div');
                    
                            // 2. Add your ID and Class
                            modal.id = "myModal";
                            modal.className = "modal"; // 'active' to make it visible
                            
                            // 3. Add the text/content
                            modal.innerHTML = `
                                <div class="modal-content">
                                    No QR code found in this image. Try a clearer picture!
                                </div>
                            `;

                            // 4. IMPORTANT: Append it so it sits ON TOP of the content
                            document.body.appendChild(modal);
                            
                            return;
                            imageBtn.style.display = "block"; // Bring back button if it failed
                        }
                    };
                    img.src = e.target.result;
                };

                // CRITICAL: This fires off the reader and kicks off the onload chain above!
                reader.readAsDataURL(file);
            }
        };

        // 3. Programmatically "click" the hidden input to open the file dialog
        fileInput.click();
    }

    imageBtn.addEventListener('click', selectImage);

} catch (error) {
    console.error("An error occurred during selection/decoding:", error);
}

// start flashlight when the camera is working
try {
    const flashlight = document.querySelector(".flashlight");

    flashlight.addEventListener("click", startLight);

} catch (error) {
    
}

try {
    const date = new Date();
    const fYear = date.getFullYear();

    const year = document.querySelector(".year").textContent = `© ${fYear} scanQr.com`
} catch (error) {
    
}





// function handleImageUpload(event) {
//   const file = event.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();
  
//   reader.onload = function(e) {
//     const img = new Image();
//     img.onload = function() {
//       // 1. Create an off-screen canvas
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
      
//       canvas.width = img.width;
//       canvas.height = img.height;
      
//       // 2. Draw the image onto the canvas
//       ctx.drawImage(img, 0, 0, img.width, img.height);
      
//       // 3. Extract the image pixel data
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
//       // 4. Pass the data to the jsQR decoder
//       const code = jsQR(imageData.data, imageData.width, imageData.height);
      
//       if (code) {
//         displayResult(code.data);
//       } else {
//         alert("No QR code found in this image. Try a clearer picture!");
//       }
//     };
//     img.src = e.target.result;
//   };
  
//   reader.readAsDataURL(file);
// }

// function displayResult(text) {
//   const output = document.getElementById('result-display');
//   // Check if text is a URL
//   if (text.startsWith('http://') || text.startsWith('https://')) {
//     output.innerHTML = `<a href="${text}" target="_blank" class="result-btn">Open Link: ${text}</a>`;
//   } else {
//     output.innerHTML = `<div class="result-text"><p>${text}</p><button onclick="navigator.clipboard.writeText('${text}')">Copy</button></div>`;
//   }
// }

