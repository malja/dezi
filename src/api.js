const API_URL_DATE_ENDPOINT = "http://api.malcak/dezi/date";
const API_URL_REPORT_ENDPOINT = "http://api.malcak.cz/dezi/report";
const API_URL_UPDATE_ENDPOINT = "http://api.malcak.cz/dezi/data";

/**
 * Returns date of last change in database with links to dangerous sites.
 */
const getDatabaseChangeDate = async () => {
    await fetch(API_URL_DATE_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (!response.ok) {
            throw Error("Date check endpoint does not communicate. Error: " + response.status);
        } else {
            return response.json();
        }
    });
}

/**
 * Get all links from database.
 */
const getDatabase = async () => {
    await fetch(API_URL_UPDATE_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (!response.ok) {
            throw Error("Update endpoint does not communicate. Error: " + response.status);
        } else {
            return [];
            // TODO: Replace mockup response.json();
        }
    });
}

/**
 * Send new report back to the server.
 * @param {string} url 
 * @param {string} reason
 * @returns True if site was reported successfully. 
 */
const reportSite = async (url, reason) => {
    await fetch(API_URL_REPORT_ENDPOINT, {
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