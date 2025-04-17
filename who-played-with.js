
let allPlayers = [];
let playerImages = {};
let levels = [];
let index = 0;
let score = 0;

function renderQuestion() {
  if (index >= levels.length) {
    document.getElementById("quiz").innerHTML = `<h2>✅ Game Over</h2><p>Your score: ${score}</p>`;
    return;
  }

  const level = levels[index];
  document.getElementById("name1").innerText = level.player1;
  document.getElementById("name2").innerText = level.player2;

  document.getElementById("img1").src = playerImages[level.player1] || "";
  document.getElementById("img2").src = playerImages[level.player2] || "";

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
  const level = levels[index];
  const answers = level.answers.map(a => a.name.toLowerCase());
  const pointMap = Object.fromEntries(level.answers.map(a => [a.name.toLowerCase(), a.points]));

  if (answers.includes(input)) {
    const earned = pointMap[input];
    score += earned;
    document.getElementById("feedback").innerText = `✅ Correct! +${earned} point${earned > 1 ? "s" : ""}`;
  } else {
    document.getElementById("feedback").innerText = "❌ Nope.";
  }

  const allAnswers = level.answers.map(a => `${a.name} (+${a.points})`).join(", ");
  document.getElementById("answers").innerText = `Valid answers: ${allAnswers}`;

  index++;
  setTimeout(renderQuestion, 3000);
}

window.onload = () => {
  Promise.all([
    fetch("players.json").then(res => res.json()),
    fetch("who_played_with_top30_verified_levels.json").then(res => res.json())
  ]).then(([players, levelsData]) => {
    levels = levelsData;
    allPlayers = players.map(p => p.name);
    playerImages = Object.fromEntries(players.map(p => [p.name, p.image_url]));
    renderQuestion();
  });
};
