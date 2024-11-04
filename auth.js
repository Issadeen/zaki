if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

document.addEventListener('DOMContentLoaded', (event) => {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    let timeout;
    const INACTIVITY_LIMIT = 5 * 60 * 1000;
    let countdown;

    function startTimer() {
        timeout = setTimeout(function() {
            firebase.auth().signOut().then(function() {
                window.location.href = "index.html";
            }).catch(function(error) {
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
        modal.style.display = "block";
        console.log('Modal visible');
    }

    function hideWarning() {
        modal.style.display = "none";
    }

    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = "index.html";
        } else {
            console.log('User is signed in.');
        }
    });

    let WARNING_TIME = 2 * 60 * 1000;
    let countdownTime = WARNING_TIME;

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

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

// Firestore rules to allow authenticated users to write to userReports collection
const firestoreRules = `
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/userReports/{reportId} {
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`;

firebase.firestore().settings({
  rules: firestoreRules
});
