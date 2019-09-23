document.addEventListener("DOMContentLoaded", function(event) {

    translateHtml(this.getElementsByTagName("body"));

    // Get current tab's URL
    chrome.tabs.query({active: true, currentWindow: true}, (response) => {
        let currentTab = response[0];

        // Check the URL agains the database
        chrome.runtime.sendMessage({target: "bg", type: "checkURL", data: currentTab.url}, (response) => {
            
            // Site is dangerous, show warning
            if (response.data.isDangerous) {
                let reasons_list = document.getElementById("dangerousReason");
                
                // Fill reasons
                response.data.reasons.forEach( (reason) => {
                    // Create new <li> tag with text
                    let reason_item = document.createElement("li").value = reason;
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
                if (!response.data.isBrowserURL) {

                    // Show "Safe" section
                    document.getElementById("safe").classList.remove("hidden");
                    // Hide "Main" section
                    document.getElementById("main").classList.add("hidden");

                }
            }
        })
    });
});
