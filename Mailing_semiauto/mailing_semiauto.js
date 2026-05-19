fetch("./numbers.json")
  .then(response => response.json())
  .then(numbers => {

    console.log("총 개수:", numbers.length);

    const uniqueNumbers =
      [...new Set(numbers)];

    console.log(
      "중복 제거 후 개수:",
      uniqueNumbers.length
    );

    const duplicates =
      numbers.filter(
        (item, index) =>
          numbers.indexOf(item) !== index
      );

    console.log(
      "중복 번호 목록:"
    );

    console.log(
      [...new Set(duplicates)]
    );
  });