const CHUNK_SIZE = 19;
const UNION_LIMIT = 1900;

// ======================
// 번호 검사 함수
// ======================

function validateNumbers(
  numbers,
  label
) {

  console.log(
    `\n========================`
  );

  console.log(
    `${label} 검사 시작`
  );

  console.log(
    `========================`
  );

  let invalidNumbers = [];

  let allDuplicates = [];

  // ======================
  // 이상 번호 검사
  // ======================

  numbers.forEach((num, index) => {

    const onlyNumber =
      /^\d+$/.test(num);

    const validLength =
      num.length >= 8;

    if (!onlyNumber || !validLength) {

      invalidNumbers.push({
        index,
        value: num
      });
    }
  });

  // ======================
  // 전체 중복 검사
  // ======================

  const duplicateMap = {};

  numbers.forEach((num, index) => {

    if (!duplicateMap[num]) {

      duplicateMap[num] = [];

    }

    duplicateMap[num].push(index);
  });

  Object.entries(duplicateMap)
    .forEach(([num, indexes]) => {

      if (indexes.length > 1) {

        allDuplicates.push({
          number: num,
          indexes
        });
      }
    });

  // ======================
  // 최종 결과
  // ======================

  console.log(
    `총 번호 수: ${numbers.length}`
  );

  console.log(
    `이상 번호 수: ${invalidNumbers.length}`
  );

  console.log(
    `전체 중복 번호 수: ${allDuplicates.length}`
  );

  // ======================
  // 이상 번호 상세
  // ======================

  console.log(
    `\n===== ${label} 이상 번호 상세 =====`
  );

  if (invalidNumbers.length === 0) {

    console.log("없음");

  } else {

    invalidNumbers.forEach(item => {

      console.log(
        `위치: ${item.index}`
      );

      console.log(
        `값: ${item.value}`
      );

      console.log(
        "------------------------"
      );
    });
  }

  // ======================
  // 중복 번호 상세
  // ======================

  console.log(
    `\n===== ${label} 중복 번호 상세 =====`
  );

  if (allDuplicates.length === 0) {

    console.log("없음");

  } else {

    allDuplicates.forEach(item => {

      console.log(
        `번호: ${item.number}`
      );

      console.log(
        `위치: ${item.indexes.join(", ")}`
      );

      console.log(
        "------------------------"
      );
    });
  }
}

// ======================
// 버튼 생성 함수
// ======================

function createButtons(
  numbers,
  ktContainerId,
  sktContainerId,
  titlePrefix
) {

  const ktContainer =
    document.getElementById(
      ktContainerId
    );

  const sktContainer =
    document.getElementById(
      sktContainerId
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
    // SKT 버튼
    // ======================

    const sktRecipients =
      group
        .map(num => `*281${num}`)
        .join(",");

    const sktButton =
      document.createElement("a");

    sktButton.className = "btn";

    sktButton.href =
      `sms:${sktRecipients}`;

    sktButton.textContent =
      `SKT ${titlePrefix} ${groupNumber}`;

    sktContainer.appendChild(
      sktButton
    );
  }
}


// ======================
// 노동조합 번호 불러오기
// ======================

fetch("./union_numbers.json")
  .then(response => response.json())
  .then(numbers => {

    // 1900개만 사용
    const limitedNumbers =
      numbers.slice(0, UNION_LIMIT);

    validateNumbers(
      limitedNumbers,
      "노동조합 번호"
    );

    createButtons(
      limitedNumbers,
      "kt-union-buttons",
      "skt-union-buttons",
      "노동조합"
    );
  });