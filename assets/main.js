// =====================================USERS_STORAGE===================================================================

window.users = {
    SYMBOS: {password: "HalloWelt", lessons: {cs: [], math: []}, name: 'Ihor'},
    ATTOS: {password: "CiaoMondo", lessons: {cs: [], math: []}, name: 'Akram'},
    admin: {password: "admin", lessons: {cs: [], math: []}, name: 'admin'},
}


// =====================================IMPORT/EXPORT===================================================================

function importUsers() {
    // importing the users form localStorage
    if (localStorage.getItem("users")) {
        window.users = JSON.parse(localStorage.getItem("users"))
    }
}

function exportUsers() {
    // exporting the users form localStorage
    localStorage.setItem("users", JSON.stringify(window.users))
    return JSON.parse(localStorage.getItem("users"))
}


// =====================================AUTHENTICATION==================================================================

function getCurrentUser() {
    const cookieKeys = Object.keys(Cookies.get())

    // If cookie array is not empty => return the name of authenticated user => else nothing
    if (cookieKeys.length) {
        return cookieKeys[0].toString()
    }

    return null
}

function authentication() {
    const username = $('#username').val();
    const password = $('#password').val();

    if (username && username in window.users && password === window.users[username].password) {
        Cookies.set(username, window.users[username].name)
        window.location.href = 'user.html';
        return
    }

    alert("Credential invalid!");
}

function logout() {
    // Remove cookies of authorized user and replace to login page
    Cookies.remove(getCurrentUser())
    window.location.href = 'login.html'
}


// =====================================GRADES_AVERAGE_FUNCTIONS========================================================

function getAverageGradesOfLesson(lesson) {
    // The function return the medium of all grades of one lesson
    const user = getCurrentUser()
    const arrayOfLessonsGrades = window.users[user].lessons[lesson]

    if (user && arrayOfLessonsGrades.length) {
        const sum = arrayOfLessonsGrades.reduce((v, i) => (v + i))
        return sum / arrayOfLessonsGrades.length
    }

    return 0
}

function getAverageGradesTotal() {
    // The function return the average of all lessons of the one user
    const averageCS = getAverageGradesOfLesson('cs')  // Get the average grades of lesson CS = (sum/count)
    const averageMath = getAverageGradesOfLesson('math')  // Get the average grades of lesson Math = (sum/count)
    return (averageMath + averageCS) / 2
}


// =====================================DISPLAYING======================================================================


function getArrayGratesFormatted(lesson) {
    // The function formatted array to humanity readable string
    const arrayOfLessonsGrades = window.users[getCurrentUser()].lessons[lesson];  // Get raw array [1, 5, 2, 10, 9]
    return `<p> ${arrayOfLessonsGrades.join(', ')}</p>` // Formatting in humanity readable string => "1, 5, 2, 10, 9"
}

function printVotes(lesson) {
    // The function update and display only the average of lesson and their array
    $(`#${lesson}Chronology`).html(getArrayGratesFormatted(lesson))  // The list of grades of one lesson
    $(`#${lesson}Value`).html(`${lesson}<br>avr grade: ${getAverageGradesOfLesson(lesson)}`)  // The medium value
}

function displayAllGrades() {
    // The function update and display the new values in html. do the calculate of avg for each lesson and total avg
    printVotes('cs')  // Update grades for CS
    printVotes('math')  // Update grades for Math
    $("#averageGrades").html(`Total average: ${getAverageGradesTotal()}`) // Update total grades for each lesson
}

function updateProgressBar(newValue) {
    var progressBar = $(".progress-bar");
    
    // Imposta la larghezza in base al nuovo valore
    progressBar.css("width", newValue*10 + "%");
    
    // Modifica lo stile in base al valore
    if (newValue < 4) {
        progressBar.removeClass("text-bg-success text-bg-warning").addClass("text-bg-danger");
    } else if (newValue < 6) {
        progressBar.removeClass("text-bg-success text-bg-danger").addClass("text-bg-warning");
    } else {
        progressBar.removeClass("text-bg-warning text-bg-danger").addClass("text-bg-success");
    }
    
    // Aggiorna il testo interno alla barra di progresso
    progressBar.text(newValue + "%");
}
// =====================================MANAGEMENT_OF_GRADES============================================================

function addNewGrade(lesson) {
    // The closure function return the object functionInner and this function add the new value(grade) into array
    const user = getCurrentUser()

    function addNewGradeInner() {
        const grade = parseInt($(`#${lesson}`).val())  // Getting value from input form
        if (grade && grade <= 10 && grade > 1) {  // Check if grade != 0 or null or undefined
            window.users[user].lessons[lesson].push(grade)  // Add a grade to the list of the lesson of our user
            displayAllGrades()  // Displaying new updates
            exportUsers()  // Export new updates to localStorage
        } else {
            alert(`Your grade is not available. ${grade} should be more 1 and equal or less 10`)
        }
    }

    return addNewGradeInner
}

function removeAllGrades() {
    window.users[getCurrentUser()].lessons = {cs: [], math: []}  // Clean her last grades of lessons
    displayAllGrades()  // displaying new updates
    exportUsers()  // Export new updates to localStorage
}


// =====================================DOCUMENT_IS_READY===============================================================

$(document).ready(() => {

    // import/export
    importUsers()
    exportUsers()

    // Auth
    $('#signIn').click(authentication);
    $('#logout').click(logout);

    $('#delete').click(removeAllGrades);
    $('#saveMath').click(addNewGrade('math'));
    $('#saveInformatics').click(addNewGrade('cs'));
    $('#save*').click(updateProgressBar(getAverageGradesTotal()));

    // Checking if user is already authorized
    if (getCurrentUser()) {
        displayAllGrades()
        $("#userName").text(getCurrentUser());
    }

});

