const CHUNK_SIZE = 19;

fetch("./numbers.json")
  .then(response => response.json())
  .then(numbers => {

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

      // KT
      const ktRecipients =
        group
          .map(num => `*77${num}`)
          .join(";");

      const ktButton =
        document.createElement("a");

      ktButton.className = "btn";

      ktButton.href =
        `sms:${ktRecipients}`;

      ktButton.textContent =
        `KT 문자 ${groupNumber}`;

      ktContainer.appendChild(ktButton);

      ktContainer.appendChild(
        document.createElement("br")
      );

      ktContainer.appendChild(
        document.createElement("br")
      );

      // LG U+
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

      lgContainer.appendChild(lgButton);

      lgContainer.appendChild(
        document.createElement("br")
      );

      lgContainer.appendChild(
        document.createElement("br")
      );
    }
  });