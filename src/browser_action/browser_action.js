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
 * Shows element for few ms and then hides it again.
 * @param {DOMElement} element Element which should be animated.
 * @param {number} time Number of ms for which should the dialog be visible.
 */
function animateDialog(element, time = 3500) {

    element.classList.remove("hidden");
    setTimeout((what) => {
        what.classList.add("hidden");
    }, time, element);
}


/**
 * This script "handles" what is shown in popup window (after clicking on 
 * extension icon).
 * It shows one of three sections based on URL in current tab.
 */
document.addEventListener("DOMContentLoaded", function (event) {

    // Translate __MSG_<ID>__ to string stored in _locales
    translateHtml(this.getElementsByTagName("body"));

    // Get current tab's URL
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (response) => {
        let currentTab = response[0];

        // Register listener for report button
        document.getElementById("actionReportSite").addEventListener("click", () => {

            // Load API key
            chrome.storage.sync.get("api_key", response => {
                // Try to report site
                apiReportSite(currentTab.url, response.api_key).then(reported => {
                    if (reported) {
                        animateDialog(document.getElementById("dialogReportFailed"));
                    } else {
                        animateDialog(document.getElementById("dialogReportSuccessful"));
                    }
                });
            });
        });

        // Check the URL agains the database
        chrome.runtime.sendMessage({
            target: "bg",
            type: "checkURL",
            data: currentTab.url
        }, (response) => {

            // Site is dangerous, show warning
            if (response.data.isDangerous) {
                let reasons_list = document.getElementById("dangerousReason");

                // Fill reasons
                response.data.info.reasons.forEach((reason) => {
                    // Create new <li> tag with text
                    let reason_item = document.createElement("li");
                    reason_item.innerText = reason;

                    // And append it
                    reasons_list.appendChild(reason_item);
                });

                // Show "Dangerous" section
                document.getElementById("dangerous").classList.remove("hidden");
                // And hide "Main" section
                document.getElementById("main").classList.add("hidden");

            } else {

                // I want to show different message for safe websites and browser's URLs
                // (for example home, history, etc.)
                if (!response.data.isBrowser) {

                    // Show "Safe" section
                    document.getElementById("safe").classList.remove("hidden");
                    // Hide "Main" section
                    document.getElementById("main").classList.add("hidden");

                }
            }
        })
    });
});