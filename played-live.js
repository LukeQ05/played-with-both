
let allPlayers = [];
let playerImages = {};

const levels = [
  { player1: "LeBron James", player2: "Kevin Durant", correct: ["Jeff Green"], points: [2] },
  { player1: "Shaquille O'Neal", player2: "Kobe Bryant", correct: ["Derek Fisher"], points: [1] },
  { player1: "Stephen Curry", player2: "Chris Paul", correct: ["Willie Green", "David West"], points: [3, 2] }
];

let index = 0;
let score = 0;

function renderQuestion() {
  if (index >= levels.length) {
    document.getElementById("quiz").innerHTML = `<h2>✅ Game Over</h2><p>Your score: ${score}</p>`;
    return;
  }

  const q = levels[index];
  document.getElementById("name1").innerText = q.player1;
  document.getElementById("name2").innerText = q.player2;

  document.getElementById("img1").src = playerImages[q.player1] || "";
  document.getElementById("img2").src = playerImages[q.player2] || "";

  const datalist = document.getElementById("players");
  datalist.innerHTML = "";
  allPlayers.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    datalist.appendChild(option);
  });

  document.getElementById("guess").value = "";
  document.getElementById("feedback").innerText = "";
  document.getElementById("answers").innerText = "";
}

function submitAnswer() {
  const input = document.getElementById("guess").value.trim().toLowerCase();
  const q = levels[index];
  const answers = q.correct.map(a => a.toLowerCase());
  const points = q.points;

  const idx = answers.indexOf(input);
  if (idx !== -1) {
    const earned = points[idx];
    score += earned;
    document.getElementById("feedback").innerText = `✅ Correct! +${earned} point${earned > 1 ? "s" : ""}`;
  } else {
    document.getElementById("feedback").innerText = `❌ Nope.`;
  }

  const all = q.correct.map((a, i) => `${a} (+${points[i]})`).join(", ");
  document.getElementById("answers").innerText = `Valid answers: ${all}`;

  index++;
  setTimeout(renderQuestion, 2500);
}

window.onload = () => {
  fetch('players.json')
    .then(res => res.json())
    .then(data => {
      allPlayers = data.map(p => p.name);
      playerImages = Object.fromEntries(data.map(p => [p.name, p.image_url]));
      renderQuestion();
    });
};
