export default function setServerFeedback(elem, data, time = 4000) {
    // const serverFeedback = document.querySelector('#serverFeedback');
    elem.classList.remove('alert-success', 'alert-danger');
    elem.classList.add(data.ok ? 'alert-success' : 'alert-danger');
    elem.hidden = false;
    elem.innerText = data.caption;
    setTimeout(() => {
        elem.hidden = true;
    }, time);
}
