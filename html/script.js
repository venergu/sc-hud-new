window.addEventListener("message", function (event) {
  let data = event.data;
  switch (data.action) {
    case "showHud":
      this.document.querySelector(".player-id").textContent =
        "#" + data.playerId;
      this.document.querySelector(".time").textContent = getDate();
      updateHud(data);
      displayHud(data.pauseMenu);
      break;
    case "showSettings":
      this.document.querySelector(".settings-container").style.display =
        "block";
      break;
    case "showCarHud":
      toogleCarHud(true);
      this.document.querySelector(".speedometer-value").innerHTML =
        `${data.speed}<span class="speedometer-text">km</span>`;
      this.document.querySelector(".street-name").textContent = data.street;
      this.document.querySelector(".body-bar").style.height =
        data.bodyHealth + "%";
      this.document.querySelector(".engine-bar").style.height =
        data.engineHealth + "%";
      this.document.querySelector(".fuel-bar").style.width = data.fuel + "%";
      updateLines(data.speed);
      break;
    case "closeCarHud":
      toogleCarHud(false);
      break;
  }
});

function getDate() {
  let date = new Date();
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toogleCarHud(bool) {
  if (bool == true) {
    document.querySelector(".carhud-container").style.display = "flex";
    document.querySelector(".fuel-container").style.display = "flex";
    document.querySelector(".street-container").style.display = "flex";
  } else {
    document.querySelector(".carhud-container").style.display = "none";
    document.querySelector(".fuel-container").style.display = "none";
    document.querySelector(".street-container").style.display = "none";
  }
}

let fspeed = 0;
const lines = document.querySelectorAll(".line");
const vmax = 200;

function updateLines(speed) {
  let filled =
    Math.floor((speed / vmax) * lines.length) - (speed < fspeed - 10 ? 1 : 0);
  filled = Math.max(0, filled);
  lines.forEach((line, i) => line.classList.toggle("active", i < filled));
  fspeed = speed;
}

function updateHud(data) {
  const heart = document.querySelector(".hud.heart");
  heart.style.setProperty("--after-width", data.health + "%");

  const food = document.querySelector(".hud.food");
  food.style.setProperty("--after-width", data.hunger + "%");

  const water = document.querySelector(".hud.water");
  water.style.setProperty("--after-width", data.thirst + "%");

  const mic = document.querySelector(".hud.mic");
  if (data.talking) {
    mic.classList.add("pulsing");
  } else {
    mic.classList.remove("pulsing");
  }
  if (data.talkingProximity === 1.5) {
    mic.style.setProperty("--after-width", "30%");
  } else if (data.talkingProximity === 3.0) {
    mic.style.setProperty("--after-width", "60%");
  } else if (data.talkingProximity === 6.0) {
    mic.style.setProperty("--after-width", "100%");
  }
}

function displayHud(bool) {
  if (bool == 1) {
    let body = document.querySelector("body");
    body.style.display = "none";
  } else {
    let body = document.querySelector("body");
    body.style.display = "block";
  }
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const map = {
  health: "heart",
  food: "food",
  water: "water",
  microphone: "mic",
};

for (let id in map) {
  const input = document.getElementById(id);
  const hud = document.querySelector(".hud." + map[id]);
  if (!input || !hud) continue;
  input.oninput = function (e) {
    const col = e.target.value;
    hud
      .querySelectorAll("svg path")
      .forEach((p) => p.setAttribute("fill", col));
    hud.style.color = col;
    hud.style.border = "1px solid " + col;
    const [r, g, b] = hexToRgb(col);
    hud.style.boxShadow =
      "inset 0px -6px 10px 2px rgba(" + r + "," + g + "," + b + ",0.3)";
  };
}

document.querySelector(".close-menu").addEventListener("click", function () {
  document.querySelector(".settings-container").style.display = "none";
  $.post(`https://${GetParentResourceName()}/close`);
});

document.querySelector(".wheel").addEventListener("click", function () {
  document.querySelectorAll(".hud").forEach((el) => {
    el.style.borderRadius = "25px";
  });
});

document.querySelector(".square").addEventListener("click", function () {
  document.querySelectorAll(".hud").forEach((el) => {
    el.style.borderRadius = "4px";
  });
});

const btn = document.querySelector(".cinema-mode");
const cinema = document.querySelector(".cinema");

btn.addEventListener("click", function () {
  const isOn = btn.classList.contains("on");

  btn.classList.toggle("on");
  btn.style.background = isOn ? "#FF0000" : "#3d8033ff";
  btn.textContent = isOn ? "OFF" : "ON";
  cinema.style.display = isOn ? "none" : "block";
  document.querySelector("body").style.display = isOn ? "none" : "block";
  $.post(
    `https://${GetParentResourceName()}/cinemaMode`,
    JSON.stringify({ on: !isOn })
  );
});
