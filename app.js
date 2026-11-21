
try {
    const root = document.querySelector(".root");
    const rootLink = `http://127.0.0.1:5500/`;

    root.addEventListener("click", () => {
        window.location.href = rootLink
    })
    
} catch (error) {
    console.log("The error happen at ", error);
}

//root.appendChild(link);

// Select all the chevron icons inside your FAQ items
const icons = document.querySelectorAll('.queItem i');
const questions = document.querySelectorAll('.queItem h3');

const startCamBtn = document.querySelector(".startCamBtn");
const stopCamBtn = document.querySelector(".stopCamBtn");

const imageBtn = document.querySelector(".imageBtn");



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

// Keep track of the animation frame ID globally or at a higher scope so we can stop it
let animationFrameId = null;

async function initCameraOnLoad() {
    // Check if the browser supports media devices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Browser does not support getUserMedia.");
        return;
    }

    try {
        // Request camera permissions instantly
        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        const preferredFacingMode = isMobile ? "environment" : "user";

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: preferredFacingMode }},
            audio: false
        });
        
        // Assign the stream to your video element
        videoElement.srcObject = stream;
        const track = stream.getVideoTracks()[0];
        

        // Kick off the scanning loop
        animationFrameId = requestAnimationFrame(scanQRCode);
        (scanQRCode);
        
    } catch (error) {
        console.error("Camera access denied or unavailable:", error);
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

// Function to turn off the scanner
function scanQRCode(){
    const reader = new FileReader();

    reader.onload = function(e) {
    const videoElement = new videoElement();
    videoElement.onload = function() {
        // Create an off-screen canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Scale management: Helps keep heavy phone camera pixels optimized
        const MAX_WIDTH = 800;
        let width = videoElement.width;
        let height = videoElement.height;

        if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        
        // Draw image onto the canvas
        ctx.drawImage(videoElement, 0, 0, width, height);
        
        // Extract the image pixel data
        const videoData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(videoData)
        // Pass the data to the jsQR decoder
        const code = jsQR(videoData.data, videoData.width, videoData.height);
        
        if (code) {
            console.log("Decoded Data:", code.data);
            // Call your result handler function here! 

            if (false) {
                document.getElementById("closeBtn").addEventListener("click", () =>{
                modal.classList.remove("noDisplay");
            })
            } else {
                document.getElementById("closeBtn").addEventListener("click", () =>{
                modal.classList.add("noDisplay");
            })}
            } else {
                // //alert("No QR code found in this image. Try a clearer picture!");
                // const modal = document.createElement('div');

                // // 2. Add your ID and Class
                // modal.id = "myModal";
                // modal.className = "modal"; // 'active' to make it visible
                
                // // 3. Add the text/content
                // modal.innerHTML = `
                //     <div>
                //         <div class="xIcon">
                //             <div class="xBtn" id="closeBtn"><i class="fa-solid fa-x"></i></div>
                //         </div>
                //         <div class="modalContainer">
                //             <p>No QR code found in this image. Try a clearer picture!</p>
                //         </div
                //     </div>
                // `;

                // // 4. IMPORTANT: Append it so it sits ON TOP of the content
                
                // document.body.appendChild(modal);
                
                // imageBtn.style.display = "block"; // Bring back button if it failed

                // // THIS IS FOR GET WINDOW OR DOCUMENT 
                // const windowBody = document.documentElement.classList.add("no-scroll"); 
                // document.body.classList.add("no-scroll");
                
                window.alert("Try a clearer picture");
            }
        };

        img.src = e.target.result;
    };


}

startCamBtn.addEventListener('click', initCameraOnLoad);
stopCamBtn.addEventListener('click', stopCamera);


// this handle the select image object
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
                        
                        // Pass the data to the jsQR decoder
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        
                        if (code) {
                                                        
                            //Redirect or open the link 
                            document.location.href = (`${code.data}`);

                            //const modal = document.createElement('div');
                            // modal.className = "modal"; 

                            // Fixed broken </div tag at the end of modalContainer
                            // modal.innerHTML = `
                            //     <div>
                            //         <div class="xIcon">
                            //             <div class="addUrlBtn"><i class="fa-solid fa-x" title="Add to decode history"></i></div>
                            //             <div class="xBtn"><i class="close-trigger fa-solid fa-x"></i></div>
                            //         </div>

                            //         <div class="modalContainer">
                            //             <p class="dataRetrived" title="${code.data}">${code.data}</p>
                            //             <div class="openIcon">
                            //                 <i class="fa-solid fa-copy" title="Copy" onclick="copyLink()"></i>
                            //                 <i class="fa-solid fa-share" title="Share"></i>
                            //             </div>
                            //         </div>
                            //     </div>
                            // `;


                            // Append modal to body
                            //document.body.appendChild(modal);

                            // append decode text to local storage

                            // FIX: Query the close button LOCALLY inside this specific modal instance
                            // We use a class '.close-trigger' to avoid ID collision entirely
                            // const closeBtn = modal.querySelector(".close-trigger");
                            // if (closeBtn) {
                            //     closeBtn.addEventListener("click", () => {
                            //         modal.classList.add("noDisplay");
                            //         // Clean up memory: Remove the modal completely from DOM if you're done with it
                            //         modal.remove(); 
                            //     });
                            // }

                        } else {
                            const modal = document.createElement('div');
                            modal.className = "modal"; 
                            
                            // Fixed broken </div tag at the end of modalContainer
                            modal.innerHTML = `
                                <div>
                                    <div class="xIcon">
                                        <div class="xBtn"><i class="close-trigger fa-solid fa-x"></i></div>
                                    </div>
                                    <div class="modalContainer">
                                        <p>No QR code found in this image. Try a clearer picture!</p>
                                    </div>
                                </div>
                            `;

                            document.body.appendChild(modal);

                            // FIX: Query the close button LOCALLY inside this specific error modal
                            const closeBtn = modal.querySelector(".close-trigger");
                            if (closeBtn) {
                                closeBtn.addEventListener("click", () => {
                                    modal.classList.add("noDisplay");
                                    modal.remove(); // Removes it from the DOM to avoid bloating your HTML
                                });
                            }
                                
                            if (typeof imageBtn !== 'undefined') {
                                imageBtn.style.display = "block"; 
                            }
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

    if (typeof imageBtn !== 'undefined') {
        imageBtn.addEventListener('click', selectImage);
    }

} catch (error) {
    console.error("An error occurred during selection / decoding:", error);
}

// start flashlight when the camera is working
try {
    const flashlight = document.querySelector(".flashlight");
    

} catch (error) {
    
}

try {
    const date = new Date();
    const fYear = date.getFullYear();

    document.querySelector(".year").textContent = `© ${fYear} scanqr.com`;
} catch (error) {
    
}

try {
    const themeBtn = document.querySelector(".themeBtn");
    const rootElement = document.documentElement;

    // 1. Load saved theme on page load (if any)
    const savedTheme = localStorage.getItem("data-theme");

    if (savedTheme) {
        rootElement.setAttribute("data-theme", savedTheme);
    }

    
    // 2. Toggle theme on button click
    themeBtn.addEventListener("click", () => {
        const currentTheme = rootElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        rootElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

    });

} catch (error) {
    
}
