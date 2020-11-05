function addSleepCycle(){
    const id = document.querySelector('.userId').value
    $.ajax({
        url: '/sleepcycle/add',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: {id: id},
        success: window.location.href = '/'
    });
}

function endSleepCycle(){
    const id = document.querySelector('.userId').value
    $.ajax({
        url: '/sleepcycle/end',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: {id: id},
        success: window.location.href = '/'
    });
}