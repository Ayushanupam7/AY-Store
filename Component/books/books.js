document.addEventListener('DOMContentLoaded', function() {
    // Set the launch date (YYYY, MM-1, DD, HH, MM, SS)
    const launchDate = new Date(2024, 0, 1, 0, 0, 0).getTime();
    
    // Update the countdown every second
    const countdown = setInterval(updateCountdown, 1000);
    
    // Initial call to display countdown immediately
    updateCountdown();
    
    // Handle the notify form submission
    document.getElementById("notifyForm").addEventListener("submit", handleNotifySubmit);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;
        
        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
        
        // If the countdown is finished
        if (distance < 0) {
            clearInterval(countdown);
            document.querySelector(".title").textContent = "We're Live!";
            document.querySelector(".subtitle").textContent = "Our new feature is now available. Check it out!";
            document.querySelector(".countdown").style.display = "none";
            
            // Change the logo to a checkmark
            const logo = document.querySelector(".logo");
            logo.innerHTML = '<i class="fas fa-check"></i>';
            logo.style.background = "rgba(76, 175, 80, 0.2)";
        }
    }
    
    function handleNotifySubmit(e) {
        e.preventDefault();
        const emailInput = this.querySelector("input");
        const email = emailInput.value.trim();
        
        if (validateEmail(email)) {
            // In a real app, you would send this to your server
            showNotification(`Thanks for your interest! We'll notify you at ${email} when we launch.`);
            emailInput.value = "";
        } else {
            showNotification("Please enter a valid email address.", "error");
        }
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showNotification(message, type = "success") {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Add animation
        setTimeout(() => {
            notification.style.opacity = "1";
            notification.style.transform = "translateY(0)";
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(-20px)";
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});

// Add notification styles dynamically
const style = document.createElement("style");
style.textContent = `
.notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease;
}
.notification.success {
    background: rgba(46, 125, 50, 0.9);
    backdrop-filter: blur(10px);
}
.notification.error {
    background: rgba(211, 47, 47, 0.9);
    backdrop-filter: blur(10px);
}
`;
document.head.appendChild(style);