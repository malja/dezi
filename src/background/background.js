/**
 * Wait for incomming message and reply to it.
 */
chrome.runtime.onMessage.addListener( (request, sender, reply) => {
  // Interested only in messages for background page
  if (request.target != "bg") {
    return;
  }

  if (request.type == "checkURL") {

    console.log("BG: Received message - checkURL");

    // Check URL in database
    let data = isInDatabase(request.data);

    console.log(data);

    reply({
      data: data 
    });
  }
});