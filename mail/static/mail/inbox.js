document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Submit button for email, fetch input to /emails
  document.querySelector('#form_submit').addEventListener('click', () => {

    // save input values inside of variables
    let recipients = document.querySelector('#compose-recipients').value;
    let subject = document.querySelector('#compose-subject').value;
    let body = document.querySelector('#compose-body').value;

    // fetch data from form to /emails route, than print result 
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        //save value of success message
        const mess = result.message
        //if success than render send, if not render inbox
        if (mess === "Email sent successfully.") {
          load_mailbox('sent');
        } else {
          load_mailbox('inbox');
        }
      });
      
         
  });

  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  // Fetch emails for mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      emails.forEach(function(email) {

        // save data from email to variables
        const who = email.sender;
        const to_whom = email.recipients;
        const theme = email.subject;
        const time = email.timestamp;
        const id = email.id;
        const archieve = email.archived;
        const read = email.read;
        const body = email.body;

        // create div for each email, add styl and event handler
        const element = document.createElement('div');
        element.classList.add("email-div");
        element.innerHTML = 
          `<b> ${who}</b>` +
          `<span style='margin-left: 25px'>${theme}</span>` +   
          `<span style='float: right'>${time}</span>`;
        element.addEventListener('click', function() {
          document.querySelector('#email-view').innerHTML = '';

          fetch(`/emails/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            }),
          });

          fetch(`/emails/${id}`)
          .then(response => response.json())
          .then(email => {
          
            box = document.createElement('div');
            box.innerHTML = 
              `<b>From:</b> ${who}<br>` +
              `<b>To:</b> ${to_whom}<br>` +
              `<b>Subject:</b> ${theme}<br>` +
              `<b>Timestamp:</b> ${time}<br>` +
              '<button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>' +
              '<hr>' +
              `${body}`;
              document.querySelector('#email-view').append(box);
          });
         document.querySelector('#emails-view').style.display = 'none';
         document.querySelector('#email-view').style.display = 'block';
         });
        document.querySelector('#emails-view').append(element);
        
        // change background for read emails
        if (read === true) {
          element.style.backgroundColor = 'gray';
        }; 

        // buttons with event handlers for inbox and archived mailbox
        if (mailbox === 'archive') {
          const button = document.createElement('button');
          button.innerHTML = '<b>Unarchive</b>';
          button.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
            fetch(`/emails/${id}`, {
              method: 'PUT',
              body: JSON.stringify({
                archived: false
              }),
            });
            load_mailbox('inbox');
          })
          element.appendChild(button);
        }

        if (mailbox === 'inbox') {
          const button = document.createElement('button');
          button.innerHTML = '<b>Archive</b>';
          button.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
            fetch(`/emails/${id}`, {
              method: 'PUT',
              body: JSON.stringify({
                archived: true
              }),
            });
            load_mailbox('inbox');
          })
          element.appendChild(button);
      }
    }
   )
 })


}