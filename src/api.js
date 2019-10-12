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
 * When there is any communication error, false is returned.
 * @param {string} apiKey Key returned from registration.
 * @returns {array|false} Array of objects or false on error.
 * @example Example output
 * [
 *  {
 *      website: "my.website.com",
 *      links: [
 *          "*my.website.com*"
 *      ],
 *      reasons: [
 *          "reasonId1", "reasonId2"
 *      ]
 *  }
 * ]
 */
async function apiGetDatabase(apiKey) {
    let url = new URL(API_URL_UPDATE_ENDPOINT);
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
            console.error("API responded with error: " + payload.status.message);
            return false;
        }
    }).catch(reason => {
        console.error("Communication error with the server. Reason: " + reason);
        return false;
    });
}

/**
 * Sends new report back to the server.
 * @param {string} url Link to reported URL.
 * @param {string} apiKey Key obtained from registration.
 * @returns {boolean} True if site was reported successfully. 
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
    }).then(async (response) => {

        let payload = await response.clone().json();
        if (!response.ok) {
            return false;
        } else {
            console.error("API responded with error: " + payload.status.message);
            return true;
        }
    }).catch(reason => {
        console.error("Communication error with the server. Reason: " + reason);
        return false;
    });
}