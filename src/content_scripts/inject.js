/**
 * Show popup to inform the user he/she is visiting dangerous site.
 * TODO: Edit popup overlay.
 */
const showPopup = () => {

	fetch(chrome.extension.getURL('./inject.html'))
    	.then(response => response.text())
    	.then(data => {
        	document.body.innerHTML += data;
    	}).catch(err => {
        	// TODO: handle error
    	});
}

/**
 * This function checks if the site is on the blacklist.
 */
chrome.runtime.sendMessage({target: "bg", type: "checkURL", data: window.location}, (response) => {
	let website = response.data;
	if (website.isDangerous) {
		document.getElementsByTagName("body")[0].classList.add("dangerous-site");

		let now = Date.now().getTime();
		let last_popup = Date.parse(website.userSettings.lastPopup).getTime();
		let seconds_since_last_popup = (now - last_popup)/1000;

		// TODO: Change to dynamicaly loaded number of seconds
		if (seconds_since_last_popup > 30 && !website.userSettings.ignore) {
			showPopup();
		}
	}
});