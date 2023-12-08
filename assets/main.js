

window.users = {
    SYMBOS: {password: "HalloWelt", name: 'Ihor', grades: []},
    ATTOS:  {password: "CiaoMondo", name: 'Akram', grades: []},
}

function averageGrades() {
    const user = Object.keys(Cookies.get())[0].toString()
    let sum = 0
    for (let indexGrade in window.users[user].grades){
        sum += window.users[user].grades[indexGrade]
    }
    $('#averageGrades').html(sum/window.users[user].grades.length)
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
    window.location.href = 'login.html'
}

function addNewGrades(){
    const user = Object.keys(Cookies.get())[0].toString()
    const grade = parseInt($('#matematica').val())

    if (grade){
        window.users[user].grades.push(grade)
        console.log(window.users[user].grades)
        averageGrades()
    }
}

$(document).ready(function () {
    $('#signIn').click(authentication);
    $('#save').click(addNewGrades);
    $('#logout').click(logout);
});

