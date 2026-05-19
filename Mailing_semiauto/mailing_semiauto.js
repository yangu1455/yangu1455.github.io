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
        `그룹 ${groupNumber} (${group.length}개)`
      );

      console.log(group);

      console.log(
        "------------------------"
      );
    }
  });