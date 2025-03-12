document.getElementById('webhookForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const webhookUrl = document.getElementById('webhookUrl').value.trim();
  const message = document.getElementById('message').value.trim();
  const spamCount = parseInt(document.getElementById('spamCount').value, 10) || 1;
  const responseDiv = document.getElementById('response');
  
  if (!webhookUrl || !message) {
    alert('Uzupełnij wszystkie pola.');
    return;
  }
  
  responseDiv.innerText = 'Wysyłanie wiadomości...';
  let sentCount = 0;
  let errorOccurred = false;
  
  // Funkcja do wysyłki pojedynczej wiadomości
  const sendMessage = () => {
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: message })
    })
    .then(response => {
      if (response.ok) {
        sentCount++;
      } else {
        errorOccurred = true;
        console.error('Błąd przy wysyłaniu wiadomości:', response.statusText);
      }
    })
    .catch(error => {
      errorOccurred = true;
      console.error('Błąd:', error);
    })
    .finally(() => {
      // Po wysłaniu wszystkich wiadomości wyświetlamy wynik
      if (sentCount + (errorOccurred ? 1 : 0) === spamCount) {
        if (errorOccurred) {
          responseDiv.innerText = 'Wystąpił błąd przy wysyłaniu jednej lub więcej wiadomości.';
        } else {
          responseDiv.innerText = 'Wiadomość(e) zostały wysłane!';
        }
      }
    });
  };
  
  // Wysyłamy wiadomości (spam)
  for (let i = 0; i < spamCount; i++) {
    sendMessage();
  }
});
