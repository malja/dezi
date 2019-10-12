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
 * Finds all occurences of __MSG_<MessageID>__ tags in HTML file and replaces
 * them with matching translation.
 * @param {Element} element Parent HTML element. Result is set as content of this element.
 * @param {string}  text    Element content (html or text).
 */
function replacePlaceholders(element, text) {
    let output = text.replace(/__MSG_(\w+)__/g, (match, messageId) => {
        let message = chrome.i18n.getMessage(messageId);
        return message == "" ? messageId : message;
    });

    element.innerHTML = output;
}

/**
 * Recursivelly translates HTML tag. Translation is done by replacing all occurences of
 * __MSG_<messageID>__ tags in HTML source code. Note: Root element is not translated.
 * 
 * @param {Element} element HTML element root for translation.
 */
function translateHtml(element) {

    if (element instanceof NodeList || element instanceof HTMLCollection) {
        for (let children of element) {
            replacePlaceholders(children, children.innerHTML.toString());
        }
    } else {
        replacePlaceholders(element, element.innerHTML.toString());
    }
}