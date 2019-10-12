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
 * Link to endpoint providing basic info about database.
 */
const API_URL_INFO_ENDPOINT = "https://api.malcak.cz/dezi/1/info";

/**
 * Link to endpoint where new site can be reported.
 */
const API_URL_REPORT_ENDPOINT = "https://api.malcak.cz/dezi/1/report";

/**
 * Link to endpoint with list of all database record.
 */
const API_URL_UPDATE_ENDPOINT = "https://api.malcak.cz/dezi/1/list";

/**
 * Link to endpoint which returns API key required for following communication.
 */
const API_URL_REGISTER_ENDPOINT = "https://api.malcak.cz/dezi/1/register";

/**
 * Registers this client in server. This process creates an API key which
 * is required for all future communication with the server.
 * No data is sent to the server to identificate the client itself.
 * @returns {string|boolean} API key or false on error.
 */
async function apiGetApiKey() {
    return await fetch(API_URL_REGISTER_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        let payload = await response.clone().json();
        if (response.ok) {
            // Return API key itself
            return payload.data.key;
        } else {
            console.error("API responded with error: " + payload.status.message);
            return false;
        }
    }).catch(error => {
        console.error("Communication with server failed: " + error);
        return false;
    });
}

/**
 * Returns info about database. It contains number of records (num_records)
 * and last edit date (last_edit). In case of error, false is returned.
 * @param {string} apiKey Key returned from registration.
 * @returns {object|boolean} Returns object with database information or false
 * on error.
 * @example Returned object
 * {
 *  num_records: 100,
 *  last_edit: 1570613353
 * }
 */
async function apiGetDatabaseInfo(apiKey) {

    let url = new URL(API_URL_INFO_ENDPOINT);
    url.searchParams.append("key", apiKey);

    return await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        let payload = await response.clone().json();
        if (response.ok) {
            return payload.data;
        } else {
            console.error("API server responded with error: " + payload.status.message);
            return false;
        }
    }).catch(error => {
        console.error("Communication with server failed: " + error);
        return false;
    });
}

/**
 * Returns array of objects. Each object is one link stored in online database.
 * When there is any communication error, empty array is returned.
 * @returns {object} Empty object or copy of online database.
 * @example Example output
 * [
 *  {
 *      id: 1,
 *      url: "*my.website.com*",
 *      reasons: [
 *          "One", "Two"
 *      ]
 *  }
 * ]
 */
async function apiGetDatabase(apiKey) {
    let url = new URL(API_URL_UPDATE_ENDPOINT);
    url.searchParams.append("key", apiKey);

        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response.ok) {
            /*
             * Expected data format:
             * {
             *  status: {
             *       error: false,
             *       message: "No error"
             *   },
             *   data: [
             *       {
             *           id: 1,
             *           url: "*my.website.com*",
             *           reasons: [
             *               "One", "Two"
             *           ]
             *       }, 
             *       ...
             *   ]
             * } 
             */
            let payload = response.clone().json();
            if (!payload.status || payload.data.length == 0) {
                return [];
            }

            return payload.data;

        } else {
            return [];
        }
    }).catch(reason => {
        console.log("Communication error with the server. Reason: " + reason);
        return [];
    });
}

/**
 * Sends new report back to the server.
 * @param {string} url Link to reported URL.
 * @returns True if site was reported successfully. 
 */
async function apiReportSite(url, apiKey) {
    let apiUrl = new URL(API_URL_REPORT_ENDPOINT);
    apiUrl.searchParams.append("key", apiKey);

    return await fetch(apiUrl.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            "url": url
        }
    }).then((response) => {
        if (!response.ok) {
            return false;
        } else {
            return true;
        }
    });
}