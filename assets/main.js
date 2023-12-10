window.users = {
    SYMBOS: {password: "HalloWelt", lessons: {cs: [], math: []}, name: 'Ihor'},
    ATTOS: {password: "CiaoMondo", lessons: {cs: [], math: []}, name: 'Akram'},
    admin: {password: "admin", lessons: {cs: [], math: []}, name: 'admin'},
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
    Cookies.remove(getCurrentUser())
    window.location.href = 'login.html'
}

function getCurrentUser() {
    const cookieKeys = Object.keys(Cookies.get())
    // If cookie array is not empty
    if (cookieKeys.length) {
        return cookieKeys[0].toString()
    }
}


function averageTotal() {
    const averageCS = averageGrades('cs')()
    const averageMath = averageGrades('math')()
    $("#averageGrades").html(`Total average: ${(averageCS + averageMath) / 2}`)
}

function averageGrades(lesson) {
    const user = getCurrentUser()

    function averageGradesInner() {
        let sum = 0
        for (let indexGrade in window.users[user].lessons[lesson]) {
            sum += window.users[user].lessons[lesson][indexGrade]
        }
        const sumAverage = sum / window.users[user].lessons[lesson].length || 0
        $(`#${lesson}Value`).html(`${lesson}<br>avr grade: ${sumAverage}`)
        return sumAverage
    }

    return averageGradesInner
}

function addNewGrade(lesson) {
    const user = getCurrentUser()
    const averageCalculate = averageGrades(lesson)

    function addNewGradeInner() {
        const grade = parseInt($(`#${lesson}`).val())
        if (grade) {
            window.users[user].lessons[lesson].push(grade)
            averageCalculate()
            averageTotal()
            printVotes(lesson)
            exportUsers()
        }
    }

    return addNewGradeInner
}

function printVotes(lesson) {
    const lessonDiv = $(`#${lesson}Chronology`);
    const lessonGrades = window.users[getCurrentUser()].lessons[lesson];
    lessonDiv.html(`<p> ${lessonGrades.join('; ')}</p>`)
}

function removeAllGrades() {
    window.users[getCurrentUser()].lessons = {cs: [], math: []}
    exportUsers()
    averageTotal()
    printVotes('cs')
    printVotes('math')
}


function importUsers() {
    if (localStorage.getItem("users")) {
        window.users = JSON.parse(localStorage.getItem("users"))
    }
}

function exportUsers() {
    localStorage.setItem("users", JSON.stringify(window.users))
    return JSON.parse(localStorage.getItem("users"))
}

$(document).ready(function () {

    // import/export
    importUsers()

    // Auth
    $('#signIn').click(authentication);
    $('#logout').click(logout);

    $('#delete').click(removeAllGrades);
    $('#saveMath').click(addNewGrade('math'));
    $('#saveInformatics').click(addNewGrade('cs'));

    averageTotal()
    printVotes('cs')
    printVotes('math')
});

