const CHUNK_SIZE = 19;

// ======================
// 버튼 생성 함수
// ======================

function createButtons(
  numbers,
  ktContainerId,
  lgContainerId,
  titlePrefix
) {

  const ktContainer =
    document.getElementById(
      ktContainerId
    );

  const lgContainer =
    document.getElementById(
      lgContainerId
    );

  for (
    let i = 0;
    i < numbers.length;
    i += CHUNK_SIZE
  ) {

    const group =
      numbers.slice(i, i + CHUNK_SIZE);

    const groupNumber =
      Math.floor(i / CHUNK_SIZE) + 1;

    console.log(
      `\n===== ${titlePrefix} 그룹 ${groupNumber} (${group.length}개) =====`
    );

    group.forEach((num, idx) => {

      console.log(
        `${idx + 1}. ${num}`
      );
    });

    // ======================
    // KT 버튼
    // ======================

    const ktRecipients =
      group
        .map(num => `*77${num}`)
        .join(",");

    const ktButton =
      document.createElement("a");

    ktButton.className = "btn";

    ktButton.href =
      `sms:${ktRecipients}`;

    ktButton.textContent =
      `KT ${titlePrefix} ${groupNumber}`;

    ktContainer.appendChild(
      ktButton
    );

    // ======================
    // LG 버튼
    // ======================

    const lgRecipients =
      group
        .map(num => `${num}%23`)
        .join(",");

    const lgButton =
      document.createElement("a");

    lgButton.className = "btn";

    lgButton.href =
      `sms:${lgRecipients}`;

    lgButton.textContent =
      `LG ${titlePrefix} ${groupNumber}`;

    lgContainer.appendChild(
      lgButton
    );
  }
}

// ======================
// 일반 번호 불러오기
// ======================

fetch("./numbers.json")
  .then(response => response.json())
  .then(numbers => {

    createButtons(
      numbers,
      "kt-buttons",
      "lg-buttons",
      "문자"
    );
  });

// ======================
// 다문화 번호 불러오기
// ======================

fetch("./multicultural_numbers.json")
  .then(response => response.json())
  .then(numbers => {

    createButtons(
      numbers,
      "kt-multi-buttons",
      "lg-multi-buttons",
      "다문화"
    );
  });