const CHUNK_SIZE = 19;

fetch("./numbers.json")
  .then(response => response.json())
  .then(numbers => {

    console.log("총 번호 수:", numbers.length);

    // ======================
    // 통계 변수
    // ======================

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
    // 버튼 영역 가져오기
    // ======================

    const normalContainer =
      document.getElementById(
        "normal-buttons"
      );

    const ktContainer =
      document.getElementById(
        "kt-buttons"
      );

    const lgContainer =
      document.getElementById(
        "lg-buttons"
      );

    // ======================
    // 버튼 생성
    // ======================

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
        `\n===== 그룹 ${groupNumber} (${group.length}개) =====`
      );

      group.forEach((num, idx) => {

        console.log(
          `${idx + 1}. ${num}`
        );
      });

      // ======================
      // 비상 버튼 생성
      // ======================

      const normalRecipients =
        group.join(",");

      const normalButton =
        document.createElement("a");

      normalButton.className = "btn";

      normalButton.href =
        `sms:${normalRecipients}`;

      normalButton.textContent =
        `비상 문자 ${groupNumber}`;

      normalContainer.appendChild(
        normalButton
      );

      // ======================
      // KT 버튼 생성
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
        `KT 문자 ${groupNumber}`;

      ktContainer.appendChild(
        ktButton
      );

      // ======================
      // LG 버튼 생성
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
        `LG 문자 ${groupNumber}`;

      lgContainer.appendChild(
        lgButton
      );
    }

    // ======================
    // 최종 종합 결과
    // ======================

    console.log("\n========================");
    console.log("최종 검사 결과");
    console.log("========================");

    console.log(
      `총 번호 수: ${numbers.length}`
    );

    console.log(
      `이상 번호 수: ${invalidNumbers.length}`
    );

    console.log(
      `전체 중복 번호 수: ${allDuplicates.length}`
    );

    console.log("========================");

    // ======================
    // 이상 번호 상세
    // ======================

    console.log("\n===== 이상 번호 상세 =====");

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
    // 전체 중복 번호 상세
    // ======================

    console.log("\n===== 전체 중복 번호 상세 =====");

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

  });