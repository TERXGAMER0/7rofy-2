document.addEventListener("DOMContentLoaded", function () {
  // --- منطق التحقق من رمز التفعيل ---
  document.getElementById("secret-submit").addEventListener("click", function () {
    var code = document.getElementById("secret-code").value.trim();
    fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    })
      .then(response => response.json())
      .then(data => {
        if (data.valid) {
          document.getElementById("secret-overlay").style.display = "none";
        } else {
          document.getElementById("error-message").style.display = "block";
        }
      })
      .catch(err => console.error("Error during verification:", err));
  });
  
  // --- كود اللعبة الأصلي ---
  const arabicLetters = [
    '\u0627', '\u0628', '\u062A', '\u062B', '\u062C', '\u062D', '\u062E', '\u062F', '\u0630',
    '\u0631', '\u0632', '\u0633', '\u0634', '\u0635', '\u0636', '\u0637', '\u0638', '\u0639',
    '\u063A', '\u0641', '\u0642', '\u0643', '\u0644', '\u0645', '\u0646', '\u0647', '\u0648', '\u064A'
  ];
  const fields = [
    "جغرافيا", "حيوانات", "عواصم", "مدن", "رياضة", "نباتات", "مشاهير", "تاريخ", "اغاني", "افلام",
    "العاب", "لغات", "التلفزيون", "تراث", "اكلات", "معلومات عامة", "مصطلحات", "اصوات", "اسلاميات", "عملات",
    "لاعبين", "الغاز", "اختراعات", "انمي", "تقنية", "ممثلين", "مسلسلات"
  ];
  const buttons = Array.from({ length: 25 }, (_, i) => document.getElementById(`btn${i + 1}`));
  let usedLetters = [];
  let usedFields = [];
  let currentMode = "letters"; // الوضع الافتراضي: الحروف

  function getRandomUniqueItems(items, count) {
    let shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // تخصيص الحروف للأزرار
  function assignLettersToButtons() {
    currentMode = "letters";
    usedLetters = getRandomUniqueItems(arabicLetters, buttons.length);
    buttons.forEach((btn, index) => {
      btn.textContent = usedLetters[index];
      btn.dataset.clickCount = 0;
      btn.style.fontSize = "50px";
    });
  }

  // تخصيص المجالات للأزرار
  function assignFieldsToButtons() {
    currentMode = "fields";
    usedFields = getRandomUniqueItems(fields, buttons.length);
    buttons.forEach((btn, index) => {
      btn.textContent = usedFields[index];
      btn.dataset.clickCount = 0;
      btn.style.fontSize = "20px";
    });
  }

  function btnClick(buttonId) {
    const button = document.getElementById(buttonId);
    const currentBackgroundColor = window.getComputedStyle(button).backgroundColor;
    const buttonIndex = Number(buttonId.slice(3)) - 1;
    let newColor = "noColor";
    if (currentBackgroundColor === "rgb(246, 241, 238)") {
      newColor = "#45eb04";
      button.style.backgroundColor = newColor;
      button.style.color = "transparent";
      updateDynamicStyles(buttonId, newColor);
    } else if (currentBackgroundColor === "rgb(69, 235, 4)") {
      newColor = "#c80000";
      button.style.backgroundColor = newColor;
      button.style.color = "transparent";
      updateDynamicStyles(buttonId, newColor);
    } else if (currentBackgroundColor === "rgb(200, 0, 0)") {
      newColor = "#f6f1ee";
      button.style.backgroundColor = newColor;
      button.style.color = "#000080";
      if (currentMode === "letters") {
        button.textContent = usedLetters[buttonIndex];
      } else if (currentMode === "fields") {
        button.textContent = usedFields[buttonIndex];
      }
      updateDynamicStyles(buttonId, newColor);
    }
    button.dataset.clickCount = (parseInt(button.dataset.clickCount) + 1) % 3;
  }

  function updateDynamicStyles(buttonId, color) {
    addDynamicStyle(`#${buttonId}:before`, `
      position: absolute;
      top: -25px;
      left: 0;
      width: 0;
      height: 0;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent;
      border-bottom: 25.5px solid ${color};
    `);
    addDynamicStyle(`#${buttonId}:after`, `
      position: absolute;
      bottom: -25px;
      left: 0;
      width: 0;
      height: 0;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent;
      border-top: 25.5px solid ${color};
    `);
  }

  function addDynamicStyle(selector, styles) {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `${selector} { ${styles} }`;
    document.head.appendChild(styleElement);
  }

  
  function shuffleLetters() {
    const hexagons = document.querySelectorAll(".changeable");
    const availableLetters = [...arabicLetters];
    const shuffled = [];
    for (let i = 0; i < hexagons.length; i++) {
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      shuffled.push(availableLetters[randomIndex]);
      availableLetters.splice(randomIndex, 1);
    }
    hexagons.forEach((hex, index) => {
      hex.classList.add("fade");
      setTimeout(() => {
        hex.textContent = shuffled[index];
        hex.dataset.letter = shuffled[index];
        hex.style.backgroundColor = "#ffffe0";
        hex.classList.remove("fade");
      }, 50 * index);
    });
    stopPartyMode();
  }

  function swapColors() {
    const redHexagons = document.querySelectorAll(".red-fixed");
    const greenHexagons = document.querySelectorAll(".green-fixed");
    const changeableHexagons = document.querySelectorAll(".changeable");
    const currentSet = colorSets[currentColorSetIndex];
    redHexagons.forEach((hex) => {
      hex.classList.remove("red-fixed");
      hex.classList.add("green-fixed");
      hex.style.backgroundColor = currentSet.green;
    });
    greenHexagons.forEach((hex) => {
      hex.classList.remove("green-fixed");
      hex.classList.add("red-fixed");
      hex.style.backgroundColor = currentSet.red;
    });
    changeableHexagons.forEach((hex) => {
      const currentColor = rgbToHex(hex.style.backgroundColor);
      if (currentColor === currentSet.red) {
        hex.style.backgroundColor = currentSet.green;
      } else if (currentColor === currentSet.green) {
        hex.style.backgroundColor = currentSet.red;
      }
    });
  }

  function changeColorSet() {
    const oldSet = colorSets[currentColorSetIndex];
    currentColorSetIndex = (currentColorSetIndex + 1) % colorSets.length;
    const currentSet = colorSets[currentColorSetIndex];
    const redHexagons = document.querySelectorAll(".red-fixed");
    const greenHexagons = document.querySelectorAll(".green-fixed");
    const changeableHexagons = document.querySelectorAll(".changeable");
    redHexagons.forEach((hex) => {
      hex.classList.add("color-transition");
      hex.style.backgroundColor = currentSet.red;
    });
    greenHexagons.forEach((hex) => {
      hex.classList.add("color-transition");
      hex.style.backgroundColor = currentSet.green;
    });
    changeableHexagons.forEach((hex) => {
      hex.classList.add("color-transition");
      const currentColor = rgbToHex(hex.style.backgroundColor);
      if (currentColor === oldSet.red) {
        hex.style.backgroundColor = currentSet.red;
      } else if (currentColor === oldSet.green) {
        hex.style.backgroundColor = currentSet.green;
      }
    });
    setTimeout(() => {
      document.querySelectorAll(".color-transition").forEach((hex) => {
        hex.classList.remove("color-transition");
      });
    }, 500);
    stopPartyMode();
  }

  function partyMode() {
    if (partyInterval) return;
    const partyText = document.getElementById("partyText");
    const body = document.body;
    partySound.currentTime = 0;
    partySound.play().catch((err) => console.error("فشل تشغيل الصوت:", err));
    partyText.style.display = "block";
    body.classList.add("active");
    document.querySelectorAll(".hexagon").forEach((hex) => {
      hex.classList.add("color-transition");
    });
    partyInterval = setInterval(() => {
      swapColors();
      const currentSet = colorSets[currentColorSetIndex];
      const currentTextColor = rgbToHex(partyText.style.color);
      partyText.style.color = currentTextColor === "#ffd700" ? currentSet.red : "#ffd700";
    }, 300);
    setTimeout(() => {
      stopPartyMode();
    }, 5000);
  }

  function stopPartyMode() {
    if (partyInterval) {
      clearInterval(partyInterval);
      partyInterval = null;
      document.querySelectorAll(".hexagon").forEach((hex) => {
        hex.classList.remove("color-transition");
      });
      document.getElementById("partyText").style.display = "none";
      document.body.classList.remove("active");
      partySound.pause();
      partySound.currentTime = 0;
    }
  }

  document.addEventListener("click", (e) => {
    const hex = e.target;
    if (hex.classList.contains("changeable")) {
      const currentColor = rgbToHex(hex.style.backgroundColor);
      const currentSet = colorSets[currentColorSetIndex];
      let newColor;
      if (currentColor === "#ffffe0") {
        newColor = "#ffa500";
      } else if (currentColor === "#ffa500") {
        newColor = currentSet.green;
      } else if (currentColor === currentSet.green) {
        newColor = currentSet.red;
      } else if (currentColor === currentSet.red) {
        newColor = "#ffffe0";
      } else {
        newColor = "#ffffe0";
      }
      hex.style.backgroundColor = newColor;
    }
  });

  function copyLetters() {
    const changeableHexagons = document.querySelectorAll(".changeable");
    let letterText = "";
    changeableHexagons.forEach((hex) => {
      letterText += hex.textContent + " ";
    });
    navigator.clipboard.writeText(letterText.trim())
      .then(() => {
        alert("تم نسخ الحروف بنجاح!");
      })
      .catch((err) => {
        console.error("فشل في النسخ: ", err);
        alert("حدث خطأ أثناء النسخ.");
      });
  }

  document.getElementById("shuffleLettersBtn").addEventListener("click", assignLettersToButtons);
  document.getElementById("addFieldsBtn").addEventListener("click", assignFieldsToButtons);
  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      btnClick(btn.id);
    });
  });
  // تهيئة اللعبة بالافتراضي (الحروف)
  assignLettersToButtons();
});

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'924a89600f9644de',t:'MTc0MjY5NzMzOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
