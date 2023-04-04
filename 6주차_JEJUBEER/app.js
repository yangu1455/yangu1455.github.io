// Q&A
const questions = document.querySelectorAll(".question");

questions.forEach(function (question) {
  const q_title = question.querySelector(".question-title");
  q_title.addEventListener("click", function () {
    questions.forEach(function (item) {
      if (item !== question) {
        item.classList.remove("show-text");
      }
    });
    question.classList.toggle("show-text");
  });
});


// top button
// 일정 영역 이상 아래로 내려가면 보이게 하는 것, 그리고 그 영역을 벗어나지않으면 안보이게 하는 것
const topLink = document.querySelector(".top-link");
window.addEventListener("scroll", function () {
  const scrollHeight = window.pageYOffset;
  // setup back to top link
  if (scrollHeight > 500) {
    topLink.classList.add("show-link");
  } else {
    topLink.classList.remove("show-link");
  }
});

// 스크롤 기능
const scrollLinks = document.querySelectorAll(".scroll-link");
scrollLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    window.scrollTo({
      left: 0,
      top: 0,
    });
  });
});