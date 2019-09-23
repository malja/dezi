/**
 * Find all occurences of __MSG_<MessageID>__ tags in HTML file and replaces
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
 * Recursivelly translate HTML tag. Translation is done by replacing all occurences of
 * __MSG_<messageID>__ tags in HTML source code. Note: Root element is not translated.
 * 
 * @param {Element} element HTML element root for translation.
 */
function translateHtml(element) {
    
    if (element instanceof NodeList || element instanceof HTMLCollection) {
        for(let children of element) {
            replacePlaceholders(children, children.innerHTML.toString());
        }
    } else {        
        replacePlaceholders(element, element.innerHTML.toString());
    }
}