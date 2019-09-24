// This file contains functions for manipulation with local database.

/**
 * Checks for updates and downloads them if necessary.
 * @returns True if database was updated.
 */
async function updateDatabase() {
    chrome.storage.local.get(["database_last_change"], (result) => {
        getDatabaseChangeDate().then((last_change) => {
            // Is offline database outdated?
            if ( Date.parse(last_change.date) > Date.parse(result.database_last_change) ) {
                // Download updates
                getDatabase().then((db) => {
                    // And store them
                    chrome.storage.local.set({database: db});
                    chrome.storage.local.set({database_last_change: last_change.date});
                    return true;
                });
function urlMatch(original, rule) {
    var escapeRegex = (original) => original.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(original);
            }
        });
        
        return false;
    });
}

function isInDatabase(url_check) {
    chrome.storage.local.get(["database"], (result) => {

        var hostname = new URL(url_check).hostname;

        for (let record of result) {
            if (record.url == hostname) {
                return Object.assign(result, {
                    isDangerous: true,
                    isBrowser: false,
                });
            }
        }

        let is_browser = false;

        for (let browser_url of browser_url_list) {
            // TODO: Match URL
            if (browser_url == url_check) {
                is_browser = true;
                break;
            }
        }

        // Site is not dangerous
        return {
            url: url_check,
            isDangerous: false,
            isBrowserURL: is_browser,
            reasons: [],
            linkMoreInfo: "",
            userSettings: {
                lastPopup: Date.now(),
                ignore: false
            }
        };
        
    });
}
