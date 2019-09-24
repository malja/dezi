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
 * Wait for incomming messages from browser action (popup) or content script. 
 * Each message comming to bg is required to contain following fields:
 * - target - Contains string "bg". It is just (probably useless) information
 *            that message is intended for background page.
 * - type   - Contains string with message type. Currently, only two types are
 *            implemented:
 *              - "checkURL" - Request background page to do a lookup in
 *                database and return information about giver URL.
 *              - "updateWebsiteSettings" - Request updating settings for given
 *                URL.
 * - data   - Content depends on message type. 
 *            
 *            For "checkURL", data is a string with URL.
 *            
 *            In case of "updateWebsiteSettings", data is "object" and contains
 *            two fields:
 *              - url     - String with URL.
 *              - ingore  - Boolean informing if user decided to ignore warning
 *                          for this website.
 */
chrome.runtime.onMessage.addListener((request, sender, reply) => {
  // Interested only in messages for background page
  if (request.target != "bg") { return; }

  // URL should be checked within database.
  if (request.type == "checkURL") {
    getUrlInfo(request.data).then(data => {
      reply({
        data: data
      })
    });

    return true;
  }

  // Update user settings for specified URL
  if (request.type == "updateWebsiteSettings") {

    // Get info about website, it contains url pattern, which is used as a key
    // for user_settings.websites.
    getUrlInfo(request.data.url).then(website => {
      // Get current user settings.
      getLocalSettings().then(settings => {

        // Update settings for giver url
        settings.websites[website.info.url] = {
          ignore: request.data.ignore,
          lastPopup: new Date().toString()
        };
  
        // And save the object back to browser
        chrome.storage.sync.set({
          user_settings: settings
        });
  
      });
    })

    

    return true;
  }
});