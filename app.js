(() => {
  const drop = document.getElementById('drop');
  const input = document.getElementById('fileInput');
  const board = document.getElementById('board');
  const clearBtn = document.getElementById('clear');
  const countEl = document.getElementById('count');
  const toastEl = document.getElementById('toast');
  let files = [];

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.style.display = 'none', 2200);
  }

  function updateCount() {
    countEl.textContent = files.length ? `(${files.length})` : '';
  }

  function render() {
    board.innerHTML = '';
    if (!files.length) {
      board.innerHTML = '<div class="empty">No sounds loaded</div>';
      updateCount();
      return;
    }
    files.forEach((f, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      const aud = document.createElement('audio');
      aud.src = f.url;
      aud.preload = 'metadata';
      btn.appendChild(aud);
      const nameEl = document.createElement('div');
      nameEl.className = 'name';
      nameEl.title = f.name;
      nameEl.textContent = f.name;
      btn.appendChild(nameEl);
      btn.addEventListener('click', () => {
        document.querySelectorAll('audio').forEach(a => a.pause());
        aud.currentTime = 0;
        aud.play().then(() => btn.classList.add('playing')).catch(()=>{});
        aud.onended = () => btn.classList.remove('playing');
      });
      board.appendChild(btn);
    });
    updateCount();
  }

  function addFiles(fileList) {
    const allowed = ['audio/mpeg','audio/wav','audio/x-wav','audio/ogg','audio/oga','audio/flac','audio/aac','audio/mp4','audio/x-m4a'];
    for (const file of fileList) {
      if (!allowed.includes(file.type) && !file.name.toLowerCase().match(/\.(mp3|wav|ogg|m4a|flac|aac|wma)$/)) continue;
      files.push({file, name: file.name, url: URL.createObjectURL(file)});
    }
    render();
    showToast(`Added ${files.length - (board.children.length - 1)} sound(s)`);
  }

  drop.addEventListener('click', () => input.click());
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
  drop.addEventListener('drop', e => {
    e.preventDefault();
    drop.classList.remove('dragover');
    addFiles(e.dataTransfer.files);
  });
  input.addEventListener('change', () => addFiles(input.files));
  clearBtn.addEventListener('click', () => { files = []; render(); });
  updateCount();
})();
