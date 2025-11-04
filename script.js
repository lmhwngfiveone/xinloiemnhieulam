document.addEventListener('DOMContentLoaded', () => {
  const SECRET_PASSWORD = "Hồng Thơm"; // mật khẩu đúng
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqabdvlg"; // link formspree

  let currentQuestion = 0;
  const questions = document.querySelectorAll('.question');
  const introScreen = document.getElementById('intro-screen');
  const questionsContainer = document.getElementById('questions-container');
  const apologyMessageScreen = document.getElementById('apology-message-screen');

  // Hàm gửi dữ liệu qua Formspree
  async function sendToFormspree(data) {
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        console.log("✅ Gửi dữ liệu thành công đến Formspree:", data);
      } else {
        console.error("⚠️ Gửi thất bại:", response.statusText);
      }
    } catch (err) {
      console.error("❌ Lỗi mạng khi gửi Formspree:", err);
    }
  }

  // Chuyển sang câu hỏi tiếp theo
  function nextQuestion() {
    if (currentQuestion === 0) {
      introScreen.classList.add('hidden');
      questionsContainer.classList.remove('hidden');
    } else {
      questions[currentQuestion - 1].classList.add('hidden');
    }

    if (currentQuestion < questions.length) {
      questions[currentQuestion].classList.remove('hidden');
      currentQuestion++;
    }
  }

  // Kiểm tra mật khẩu
  window.checkPassword = function() {
    const passwordInput = document.getElementById('password-input');
    const feedbackMessage = document.getElementById('feedback-message');
    const input = passwordInput.value.trim();

    // Gửi dữ liệu nhập tên đến Formspree
    sendToFormspree({
      "Câu": "Nhập mật khẩu mở lời xin lỗi",
      "Giá trị nhập": input,
      "Thời gian": new Date().toLocaleString()
    });

    if (input.toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
      questionsContainer.classList.add('hidden');
      apologyMessageScreen.classList.remove('hidden');

      // Gửi thông tin “Đã mở khóa thành công”
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

      // Gửi thông tin “Sai mật khẩu”
      sendToFormspree({
        "Trạng thái": "❌ Sai mật khẩu",
        "Tên nhập": input,
        "Thời gian": new Date().toLocaleString()
      });
    }
  }

  // Ghi lại các lựa chọn của người chơi
  window.nextQuestion = function() {
    // Nếu đang ở câu hỏi nhập text
    if (currentQuestion === 3) {
      const text = document.getElementById('apology-wish').value.trim();
      if (text) {
        sendToFormspree({
          "Câu": "Em muốn anh làm gì để bù đắp?",
          "Câu trả lời": text,
          "Thời gian": new Date().toLocaleString()
        });
      }
    }

    // Gửi thông tin lựa chọn trước đó (nếu có)
    if (currentQuestion > 0 && currentQuestion <= questions.length) {
      const prevQuestion = questions[currentQuestion - 1];
      const selectedButton = prevQuestion.querySelector('button.active');
      if (selectedButton) {
        sendToFormspree({
          "Câu hỏi": prevQuestion.querySelector('h2').innerText,
          "Lựa chọn": selectedButton.innerText,
          "Thời gian": new Date().toLocaleString()
        });
      }
    }

    // Tiếp tục tới câu tiếp theo
    nextQuestion();
  }

  // Khi click nút chọn trong các câu hỏi
  document.querySelectorAll('.question button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // đánh dấu nút được chọn
      e.target.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
});
