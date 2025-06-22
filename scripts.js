function showDigitalClock() {
  const clockElement = document.getElementById('digitalClock');
  if (!clockElement) return;

  setInterval(() => {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString();
  }, 1000);
}

function showAnalogClock() {
  const canvas = document.getElementById('analogClock');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const radius = canvas.height / 2;
  ctx.translate(radius, radius);

  function drawClock() {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
  }

  function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  function drawNumbers(ctx, radius) {
    const angStep = Math.PI / 6;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (let num = 1; num <= 12; num++) {
      const ang = num * angStep;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
  }

  function drawTime(ctx, radius) {
    const now = new Date();
    let hour = now.getHours() % 12;
    let minute = now.getMinutes();
    let second = now.getSeconds();

    hour = hour * Math.PI / 6 + minute * Math.PI / (6 * 60) + second * Math.PI / (360 * 60);
    drawHand(ctx, hour, radius * 0.5, radius * 0.07);

    const minuteAngle = minute * Math.PI / 30 + second * Math.PI / (30 * 60);
    drawHand(ctx, minuteAngle, radius * 0.75, radius * 0.07);

    const secondAngle = second * Math.PI / 30;
    drawHand(ctx, secondAngle, radius * 0.85, radius * 0.02, 'red');
  }

  function drawHand(ctx, pos, length, width, color = '#333') {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  setInterval(drawClock, 1000);
}

function setupEmailToggle() {
  const btn = document.getElementById('emailToggleBtn');
  const email = document.getElementById('emailText');
  if (!btn || !email) return;

  btn.addEventListener('click', () => {
    if (email.style.display === 'none' || email.style.display === '') {
      email.style.display = 'inline';
      btn.textContent = 'Hide Email';
    } else {
      email.style.display = 'none';
      btn.textContent = 'Show Email';
    }
  });
}

function showCurrentDate() {
  const dateElem = document.getElementById('currentDate');
  if (!dateElem) return;
  const now = new Date();
  dateElem.textContent = now.toDateString();
}

function fetchJoke() {
  const jokeElem = document.getElementById('jokeText');
  if (!jokeElem) return;

  fetch('https://v2.jokeapi.dev/joke/Any')
    .then(response => response.json())
    .then(data => {
      if (data.type === 'single') {
        jokeElem.textContent = data.joke;
      } else if (data.type === 'twopart') {
        jokeElem.textContent = data.setup + ' ... ' + data.delivery;
      }
    })
    .catch(error => {
      jokeElem.textContent = 'Failed to load joke.';
    });
}

setInterval(fetchJoke, 60000);

function fetchXkcdComic() {
  const comicElem = document.getElementById('xkcdComic');
  if (!comicElem) return;

  fetch('https://xkcd.now.sh/?comic=latest')
    .then(response => response.json())
    .then(data => {
      comicElem.innerHTML = `<h3>${data.safe_title}</h3>
                             <img src="${data.img}" alt="${data.alt}" style="max-width:100%;">`;
    })
    .catch(error => {
      comicElem.textContent = 'Failed to load comic.';
    });
}

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

function checkVisitor() {
  const visitElem = document.getElementById('visitorMessage');
  if (!visitElem) return;

  const lastVisit = getCookie('lastVisit');
  const now = new Date().toLocaleString();

  if (lastVisit === "") {
    visitElem.textContent = "Welcome to my homepage for the first time!";
  } else {
    visitElem.textContent = `Welcome back! Your last visit was ${lastVisit}`;
  }

  setCookie('lastVisit', now, 365);
}

// Final combined onload function
window.onload = function () {
  showDigitalClock();
  showAnalogClock();
  setupEmailToggle();
  showCurrentDate();
  fetchJoke();
  fetchXkcdComic();
  checkVisitor();
};
