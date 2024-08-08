// Description: This file contains the code for user authentication and session management.
// Your Firebase configuration
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];


    // Set timeout for inactivity
    let timeout;
    const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
    
    let countdown;

    function startTimer() {
        timeout = setTimeout(function() {
            firebase.auth().signOut().then(function() {
                // Sign-out successful, redirect to index.html
                window.location.href = "index.html";
            }).catch(function(error) {
                // An error occurred.
                console.error('Error during sign out:', error);
            });
        }, INACTIVITY_LIMIT);
    }

    function resetTimer() {
        clearTimeout(timeout);
        startTimer();
        hideWarning();
        clearInterval(countdown);
    }

    function showWarning() {
        // Display warning to user
        modal.style.display = "block";
        console.log('Modal visible');
    }

    function hideWarning() {
        // Hide warning from user
        modal.style.display = "none";
    }

    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    // Check user authentication status
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // User is not signed in, redirect to index.html
            window.location.href = "index.html";
        } else {
            console.log('User is signed in.');
        }
    });

let WARNING_TIME = 2 * 60 * 1000; // 2 minutes
let countdownTime = WARNING_TIME; // Countdown time starts at WARNING_TIME

// Show warning 3 minutes before session ends
setTimeout(() => {
    countdown = setInterval(() => {
        console.log('Countdown before modal warning:', countdownTime / 1000);
        countdownTime -= 1000;
        if (countdownTime <= 0) {
            clearInterval(countdown);
            console.log('Showing modal warning...');
            showWarning();
            if (modal.style.display === "block") {
                console.log('Modal warning successfully shown.');
            } else {
                console.log('Failed to show modal warning.');
            }
        }
    }, 1000);
}, INACTIVITY_LIMIT - WARNING_TIME);
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
});
