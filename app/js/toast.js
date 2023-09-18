export function triggerToast(title, description, type = 'info') {
    // Clone template
    const toastTemplate = document.querySelector('#toast-template');
    let toastTemplateClone = toastTemplate.cloneNode(true).content.querySelector('.toast');

    // Set title or icon
    if (type === 'info') {
        toastTemplateClone.classList.add('info')
        toastTemplateClone.querySelector('dl dt').innerHTML = '<img src="images/icons/info.svg" height="24" width="24" alt="Info icon" /> ' + title;
    } else if (type === 'warning') {
        toastTemplateClone.classList.add('warning')
        toastTemplateClone.querySelector('dl dt').innerHTML = '<img src="images/icons/warning.svg" height="24" width="24" alt="Warning icon" /> ' + title;
    } else if (type === 'error') {
        toastTemplateClone.classList.add('error')
        toastTemplateClone.querySelector('dl dt').innerHTML = '<img src="images/icons/error.svg" height="24" width="24" alt="Error icon" /> ' + title;
    } else {
        toastTemplateClone.querySelector('.toast dl dt').innerText = title;
    }

    toastTemplateClone.querySelector('dl dd').innerText = description;

    // Add toast to body
    document.querySelector('body').appendChild(toastTemplateClone, true);

    setTimeout(function () {
        document.querySelector('.toast').remove();
    }, 3500);
};