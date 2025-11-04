document.addEventListener('DOMContentLoaded', () => {
  const SECRET_PASSWORD = "Hồng Thơm"; 
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqabdvlg"; // đổi nếu bạn có endpoint khác

  let currentQuestion = 0;
  const questions = document.querySelectorAll('.question');
  const introScreen = document.getElementById('intro-screen');
  const questionsContainer = document.getElementById('questions-container');
  const apologyMessageScreen = document.getElementById('apology-message-screen');

  // Hàm gửi dữ liệu qua Formspree
  async function sendToFormspree(data) {
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error("Không gửi được:", err);
    }
  }

  // Hiển thị câu hỏi kế tiếp
  window.nextQuestion = function() {
    if (currentQuestion === 0) {
      introScreen.classList.add('hidden');
      questionsContainer.classList.remove('hidden');
    } else {
      questions[currentQuestion - 1].classList.add('hidden');
    }

    // Ghi nhận dữ liệu của câu trước (nếu có)
    if (currentQuestion > 0 && currentQuestion <= questions.length) {
      const prevQuestion = questions[currentQuestion - 1];
      const h2 = prevQuestion.querySelector('h2');
      const textInput = prevQuestion.querySelector('textarea');
      const selected = prevQuestion.querySelector('button.selected');

      let answer = "";
      if (textInput) answer = textInput.value.trim();
      else if (selected) answer = selected.innerText;

      if (answer) {
        sendToFormspree({
          "Câu hỏi": h2 ? h2.innerText : "Không rõ",
          "Câu trả lời": answer,
          "Thời gian": new Date().toLocaleString()
        });
      }
    }

    // Chuyển sang câu hỏi tiếp theo
    if (currentQuestion < questions.length) {
      questions[currentQuestion].classList.remove('hidden');
      currentQuestion++;
    }
  }

  // Khi bấm chọn đáp án
  document.querySelectorAll('.question button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.target.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');
    });
  });

  // Kiểm tra mật khẩu
  window.checkPassword = function() {
    const passwordInput = document.getElementById('password-input');
    const feedbackMessage = document.getElementById('feedback-message');
    const input = passwordInput.value.trim();

    sendToFormspree({
      "Câu hỏi": "Mật khẩu mở lời xin lỗi",
      "Câu trả lời": input,
      "Thời gian": new Date().toLocaleString()
    });

    if (input.toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
      questionsContainer.classList.add('hidden');
      apologyMessageScreen.classList.remove('hidden');

      sendToFormspree({
        "Trạng thái": "✅ Nhập đúng mật khẩu",
        "Tên nhập": input,
        "Thời gian": new Date().toLocaleString()
      });
    } else {
      feedbackMessage.textContent = "Sai mật khẩu rồi, em thử lại nhé!";
      feedbackMessage.classList.remove('hidden');
      feedbackMessage.classList.remove('text-green-600');
      feedbackMessage.classList.add('text-red-600');
    }
  }
});
