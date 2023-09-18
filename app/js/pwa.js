export function triggerPwaPopUp() {

    // User Agent is Android
    if (navigator.userAgent.match(/Android/i)) {
        // Select template
        const androidPopupTemplate = document.querySelector('#android-popup-template');
        const androidPopup = androidPopupTemplate.cloneNode(true).content.querySelector('#android-pwa-popup');

        // Add pop-up to body
        document.querySelector('body').appendChild(androidPopup, true);

        // Remove pop-up after 6 sec
        setTimeout(function () {
            document.querySelector('#android-pwa-popup').remove();
        }, 6000);
    }

    // User Agent is iPhone, iPad or iPod
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        // Select template
        const iosPopupTemplate = document.querySelector('#ios-popup-template');
        const iosPopup = iosPopupTemplate.cloneNode(true).content.querySelector('#ios-pwa-popup');

        // Add pop-up to body
        document.querySelector('body').appendChild(iosPopup, true);

        // Remove pop-up after 6 sec
        setTimeout(function () {
            document.querySelector('#ios-pwa-popup').remove();
        }, 6000);
    }
}