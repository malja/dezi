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
 * Checks if original url matches given rule. Rule is a string which contains
 * * (star) as wildcard for any number of characters.
 * @param {string} original URL which should match the rule.
 * @param {string} rule Rule for matching. Use * as wildcard for any number of
 * characters.
 */
function urlMatch(original, rule) {
    var escapeRegex = (original) => original.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(original);
}

/**
 * Checks if obj contains all keys in listOfKeys.
 * @param {object} obj Object which is checked.
 * @param {array} listOfKeys List of all keys required inside the object.
 */
function hasKeys(obj, listOfKeys) {
    // Object is empty
    if (Object.getOwnPropertyNames(obj).length == 0) {
        return false;
    }
    
    if (!Array.isArray(listOfKeys) || listOfKeys.length == 0) {
        throw TypeError("List of keys has to be an array");
    }

    // Check all keys
    for (let key of listOfKeys) {
        if (!obj.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
};

/**
 * Check if url is an internal one (used by the browser).
 * @param {string} url_check Current URL which should be tested.
 */
function isBrowserUrl(url_check) {
    
    if (typeof url_check !== "string") {
        throw TypeError("Url is not a string.");
    }

    let url = new URL(url_check);
    
    // In chrome, all internal URLs start with chrome:// protocol
    if (browser_url_list.includes(url.protocol)) {
        return true;
    }

    // In firefox, internal urls start with about:
    for(let browser_url of browser_url_list) {
        if (url_check.startsWith(browser_url)) {
            return true;
        }
    }

    return false;
}

/**
 * Asynchronously return local user settings.
 */
function getLocalSettings() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["user_settings"], results => {

            if (!hasKeys(results, ["user_settings"])) {
                reject("No settings");
            }

            resolve(results.user_settings);
        });
    });
}

/**
 * Returns user settings for selected URL.
 * @param {string} url_check URL for which should be the settings returned.
 */
async function getUserSettingsForUrl(url_check) {
    
    let defaut_settings = {
        ignore: false,
        lastPopup: "1990-01-01T01:01:01"
    };

    let settings = await getLocalSettings();
    
    if (url_check in settings.websites) {
        return settings.websites[url_check];
    }

    chrome.storage.sync.set({
        userSettings: Object.assign(settings.websites, {
            url_check: defaut_settings
        })
    });

    return defaut_settings;
}

/**
 * Asynchronously returns whole local database.
 */
function getLocalDatabase() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["database"], result => {
            if (!hasKeys(result, ["database"])) {
                reject("No database");
            }

            resolve(result.database);
        });
    });
}

/**
 * Returns info about giver URL from local database.
 * @param {string} url_check URL to be checked.
 */
async function getUrlInfo(url_check) {

    let default_info ={
        info: {},
        isDangerous: false,
        isBrowser: isBrowserUrl(url_check),
        linkMoreInfo: "",
        userSettings: {
            lastPopup: new Date().toString(),
            ignore: false
        }
    };

    let database = await getLocalDatabase();

    for (record of database) {
        // This record's URL is matching with url_check
        if (urlMatch(url_check, record.url)) {
            // Get settings for URL
            let settings = await getUserSettingsForUrl(record.url);
            
            // Merge default settings with new data
            Object.assign(default_info, {
                info: record,
                isDangerous: true,
                linkMoreInfo: "TODO"
            }, {
                userSettings: settings
            });

            return default_info;
        }
    }

    return default_info;
}



/**
 * Checks for updates and downloads them if necessary.
 * @returns True if database was updated.
 */
async function updateDatabase() {
    chrome.storage.sync.get(["database_last_change"], (result) => {
        apiGetDatabaseInfo().then((info) => {
            // Is offline database outdated?
            if ( Date.parse(info.last_edit) > Date.parse(result.database_last_change) ) {
                // Download updates
                apiGetDatabase().then(db => {
                    
                    let data = db["data"];
                    // And store them
                    chrome.storage.sync.set({database: data});

                    chrome.storage.sync.set({database_last_change: info.last_change});
                    return true;
                });
            }
        });
        
        return false;
    });
}
