const CHUNK_SIZE = 19;

fetch("./numbers.json")
  .then(response => response.json())
  .then(numbers => {

    console.log("총 번호 수:", numbers.length);

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
    }
  });