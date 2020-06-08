function setServerFeedback(data, time = 4000) {
    const serverFeedback = document.querySelector('#serverFeedback');
    serverFeedback.classList.remove('alert-success', 'alert-danger');
    serverFeedback.classList.add(data.ok ? 'alert-success' : 'alert-danger');
    serverFeedback.hidden = false;
    serverFeedback.innerText = data.caption;
    setTimeout(() => {
        serverFeedback.hidden = true;
    }, time)
}
