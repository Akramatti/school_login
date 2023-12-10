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
    const user = Object.keys(Cookies.get())[0].toString()
    Cookies.remove(user)
    /*const grade = $("#grades");
    const textnode = grade.nextSibling;
    textnode.remove()*/
    window.location.href = 'login.html'
}


function averageTotal() {
    const averageCS = averageGrades('cs')()
    const averageMath = averageGrades('math')()
    $("#averageGrades").html(`Total average: ${(averageCS + averageMath) / 2}`)
}

function averageGrades(lesson) {
    const user = Object.keys(Cookies.get())[0].toString()

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
    const user = Object.keys(Cookies.get())[0].toString()
    const averageCalculate = averageGrades(lesson)

    function addNewGradeInner() {
        const grade = parseInt($(`#${lesson}`).val())
        if (grade) {
            window.users[user].lessons[lesson].push(grade)
            averageCalculate()
            averageTotal()
            exportUsers()
        }
    }

    return addNewGradeInner
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


function printVotesMath() {
    const mathDiv = document.getElementById('mathChronology');
    for (const user in window.users) {
        const mathVoti = window.users[user].lessons.math;
        mathDiv.innerHTML += `<p> ${mathVoti.join(', ')}</p>`;
    }
}
function printVotesCs() {
    const csDiv = document.getElementById('csChronology');
    for (const user in window.users) {
        const csVoti = window.users[user].lessons.cs;
        csDiv.innerHTML += `<p> ${csVoti.join(', ')}</p>`;
    }
}

$(document).ready(function () {

    // import/export
    importUsers()

    // Auth
    $('#signIn').click(authentication);
    $('#logout').click(logout);

    $('#saveMath').click(addNewGrade('math'));
    $('#saveInformatics').click(addNewGrade('cs'));

    averageTotal()

    printVotesMath()
    printVotesCs()
});

