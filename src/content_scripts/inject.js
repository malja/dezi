/*
 * Copyright (c) 2019 Jan Malčák
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * Show warning modal window to inform user they are visiting dangerous site.
 */
function showPopup(url) {
	// Stop page loading - make sure they are not blocking us
	window.stop();

	// Load modal's html code from given file
	fetch(chrome.extension.getURL('./src/content_scripts/modal.html'))
    	.then(response => response.text())
    	.then(data => {

			// Append my modal to <html> tag
			document.documentElement.innerHTML += data;

			// Attach event listeners to <Continue> ...
			document.getElementById("dezi-modal-close").onclick = () => {
				window.location.reload();
				chrome.runtime.sendMessage({
					target: "bg", 
					type: "updateWebsiteSettings", 
					data: {
						url: window.location.href,
						ignore: false 
					}
				});
			}

			// ... and <Continue and Ignore> buttons
			document.getElementById("dezi-modal-ignore").onclick = () => {
				window.location.reload();
				chrome.runtime.sendMessage({
					target: "bg",
					type: "updateWebsiteSettings", 
					data: {
						url: window.location.href,
						ignore: true 
					}
				});
			}
		});
}

/**
 * Request info about current tab's URL from background page and show modal
 * window when necessary.
 */
chrome.runtime.sendMessage({target: "bg", type: "checkURL", data: window.location.href}, (response) => {
	let website = response.data;

	if (website.isDangerous) {

		// Calculate number of seconds since last popup was shown for current URL
		let now = new Date().getTime();
		let last_popup = new Date(website.userSettings.lastPopup).getTime();
		let seconds_since_last_popup = (now - last_popup)/1000;

		// TODO: Change to dynamicaly loaded number of seconds
		if (seconds_since_last_popup > 30 && !website.userSettings.ignore) {
			showPopup(website.url);
		}
	}
});