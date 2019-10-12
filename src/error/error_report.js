document.addEventListener("DOMContentLoaded", () => {
    translateHtml(document.documentElement);

    let param = new URL(window.location.href).searchParams.get("error");

    if (!param) {
        param = "Unknown";
    }

    let message = chrome.i18n.getMessage(
        "erMessage" + param.replace(/[^\x00-\x7F]/g, "")
    );

    if (message == "") {
        message = chrome.i18n.getMessage("erMessageUnknown");
    }

    document.getElementById("error_report").innerText = message;
});