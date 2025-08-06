form.addEventListener('submit', async e => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const date = dateInput.value;
  const priority = document.getElementById('priority').value;
  const description = document.getElementById('description').value;
  const files = imageInput.files;

  const base64Images = await Promise.all(
    Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            filename: file.name,
            content: reader.result.split(',')[1], // odstraní "data:image/jpeg;base64,"
            encoding: 'base64'
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );

  try {
const response = await fetch('/.netlify/functions/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, date, priority, description, images: base64Images })
});

    const result = await response.json();
    alert(result.message);
    form.reset();
    preview.innerHTML = '';
    dateInput.value = new Date().toISOString().split('T')[0];
  } catch (error) {
    alert('Chyba při odesílání: ' + error.message);
  }
});
