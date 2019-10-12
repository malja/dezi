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
 * This listener is run when extension is installed, reloaded or updated. Main
 * purpose is to set default values and load database from API.
 */
chrome.runtime.onInstalled.addListener((details) => {

    // Default settings
    chrome.storage.sync.set({
        // Just to make sure update will be done anyways
        database_last_change: "1990-01-01T01:01:01",
        database: [],   // empty for now
        user_settings: {
            websites: {}
        },
        api_key: "" // empty for now
    });

    // Request new API key from the server
    apiGetApiKey().then(key => {
        if (key === false) {

            // Show new tab with error message
            showError("ApiKey");

            // Try again in 30 minutes
            // Hardcoded
            chrome.alarms.create("requestApiKey", {
                delayInMinutes: 30
            });

        } else {
            chrome.storage.sync.set({
                api_key: key
            });

    // Create alarm for updating local database
    chrome.alarms.create("checkOnlineDatabase", {
        periodInMinutes: 60*24,
        delayInMinutes: 60*24
    })
});
