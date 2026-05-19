const CHUNK_SIZE = 19;

fetch("./numbers.json")
  .then(response => response.json())
  .then(numbers => {

    console.log("총 번호 수:", numbers.length);

    // ======================
    // 전체 번호 검증
    // ======================

    console.log("\n===== 전체 번호 검증 시작 =====");

    numbers.forEach((num, index) => {

      const onlyNumber =
        /^\d+$/.test(num);

      const validLength =
        num.length >= 8;

      if (!onlyNumber || !validLength) {

        console.log(
          `⚠️ 이상 번호 발견 (index ${index})`
        );

        console.log(
          `값: "${num}"`
        );

        console.log(
          `숫자만 포함 여부: ${onlyNumber}`
        );

        console.log(
          `길이: ${num.length}`
        );

        console.log(
          "------------------------"
        );
      }
    });

    console.log(
      "===== 전체 번호 검증 종료 =====\n"
    );

    const ktContainer =
      document.getElementById("kt-buttons");

    const lgContainer =
      document.getElementById("lg-buttons");

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

        const prev =
          idx > 0
            ? group[idx - 1]
            : null;

        const next =
          idx < group.length - 1
            ? group[idx + 1]
            : null;

        const prevDuplicate =
          prev === num;

        const nextDuplicate =
          next === num;

        console.log(
          `${idx + 1}. ${num}`
        );

        if (
          prevDuplicate ||
          nextDuplicate
        ) {

          console.log(
            "⚠️ 연속 중복 감지"
          );

          console.log(
            `이전: ${prev}`
          );

          console.log(
            `현재: ${num}`
          );

          console.log(
            `다음: ${next}`
          );
        }
      });

      // ======================
      // KT 버튼 생성
      // ======================

      const ktRecipients =
        group
          .map(num => `*77${num}`)
          .join(",");

      console.log(
        `KT recipients 개수: ${
          ktRecipients.split(",").length
        }`
      );

      const ktButton =
        document.createElement("a");

      ktButton.className = "btn";

      ktButton.href =
        `sms:${ktRecipients}`;

      ktButton.textContent =
        `KT 문자 ${groupNumber}`;

      ktContainer.appendChild(ktButton);

      // ======================
      // LG 버튼 생성
      // ======================

      const lgRecipients =
        group
          .map(num => `${num}%23`)
          .join(",");

      console.log(
        `LG recipients 개수: ${
          lgRecipients.split(",").length
        }`
      );

      const lgButton =
        document.createElement("a");

      lgButton.className = "btn";

      lgButton.href =
        `sms:${lgRecipients}`;

      lgButton.textContent =
        `LG 문자 ${groupNumber}`;

      lgContainer.appendChild(lgButton);
    }
  });