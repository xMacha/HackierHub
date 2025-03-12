document.addEventListener('DOMContentLoaded', () => {
  const webhookForm = document.getElementById('webhookForm');
  const stopButton = document.getElementById('stopButton');
  const logContainer = document.getElementById('log');
  let continuousInterval = null;

  // Funkcja ładująca log z localStorage
  function loadLog() {
    const logData = localStorage.getItem('webhookLog');
    if (logData) {
      logContainer.innerHTML = logData;
    }
  }
  
  // Funkcja dodająca wpis do loga
  function appendLog(entry) {
    const time = new Date().toLocaleTimeString();
    const logEntry = `<div>[${time}] ${entry}</div>`;
    logContainer.innerHTML += logEntry;
    localStorage.setItem('webhookLog', logContainer.innerHTML);
  }
  
  // Funkcja wysyłająca wiadomość na podany webhook
  function sendMessage(webhookUrl, message) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    })
    .then(response => {
      if (response.ok) {
        appendLog(`Wysłano: ${message}`);
      } else {
        appendLog(`Błąd: ${response.statusText}`);
      }
    })
    .catch(error => {
      appendLog(`Błąd: ${error}`);
    });
  }
  
  // Funkcja zatrzymująca ciągłe wysyłanie
  function stopContinuous() {
    if (continuousInterval) {
      clearInterval(continuousInterval);
      continuousInterval = null;
      stopButton.style.display = 'none';
      appendLog('Ciągłe wysyłanie zatrzymane.');
    }
  }
  
  if (stopButton) {
    stopButton.addEventListener('click', stopContinuous);
  }
  
  if (webhookForm) {
    webhookForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const webhookUrl = document.getElementById('webhookUrl').value.trim();
      const message = document.getElementById('message').value.trim();
      const spamCount = parseInt(document.getElementById('spamCount').value, 10);
      
      if (!webhookUrl || !message) {
        alert('Uzupełnij wszystkie pola.');
        return;
      }
      
      // Jeśli liczba wiadomości wynosi 0 – wysyłanie ciągłe
      if (spamCount === 0) {
        if (continuousInterval) {
          alert('Ciągłe wysyłanie już jest aktywne.');
          return;
        }
        appendLog('Rozpoczęto ciągłe wysyłanie wiadomości.');
        continuousInterval = setInterval(() => {
          sendMessage(webhookUrl, message);
        }, 1000); // wysyłka co 1 sekundę – można dostosować interwał
        stopButton.style.display = 'inline-block';
      } else {
        // Wysyłamy określoną liczbę wiadomości
        for (let i = 0; i < spamCount; i++) {
          sendMessage(webhookUrl, message);
        }
      }
    });
  }
  
  loadLog();
});
