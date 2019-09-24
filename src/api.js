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
 * Returns info about database. In version 1 of the API, it contains number of
 * records (num_records) and last edit date (last_edit).
 */
async function apiGetDatabaseInfo() {
    return await fetch(API_URL_INFO_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (response.ok) {
            return response.clone().json().then(data => data["data"]);
        }
    });
}

/**
 * Returns all links in online database.
 */
async function apiGetDatabase() {
    return await fetch(API_URL_UPDATE_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response.ok) {
            return response.clone().json();
        }
    });
}

/**
 * Sends new report back to the server.
 * @param {string} url Link to reported URL.
 * @param {string} reason Short description why should be the site reported.
 * @returns True if site was reported successfully. 
 */
async function apiReportSite(url, reason) {
    return await fetch(API_URL_REPORT_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            "url": url,
            "reason": reason
        }
    }).then((response) => {
        if (!response.ok) {
            return false;
        } else {
            return true;
        }
    });
}
