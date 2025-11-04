document.addEventListener('DOMContentLoaded', () => {
  // 🔐 Mật khẩu bí mật (đổi nếu muốn)
  const SECRET_PASSWORD = "Hồng Thơm"; 

  // 📬 Link Formspree của bạn
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mldoyogr";

  // 🔎 Biến điều khiển
  let currentQuestion = 0;
  const answers = []; // mảng lưu toàn bộ câu trả lời

  const questions = document.querySelectorAll('.question');
  const introScreen = document.getElementById('intro-screen');
  const questionsContainer = document.getElementById('questions-container');
  const apologyMessageScreen = document.getElementById('apology-message-screen');

  // 💌 Ghi lại câu trả lời
  function recordAnswer(question, answer) {
    answers.push({
      "Câu hỏi": question,
      "Câu trả lời": answer
    });
  }

  // 📨 Gửi tất cả câu trả lời qua Formspree
  async function sendAllToFormspree() {
    const data = {
      "Tất cả câu trả lời": answers,
      "Thời gian gửi": new Date().toLocaleString()
    };

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
        console.log("✅ Gửi thành công:", data);
      } else {
        console.error("⚠️ Gửi thất bại:", response.statusText);
      }
    } catch (err) {
      console.error("❌ Lỗi mạng:", err);
    }
  }

  // 👉 Chuyển sang câu hỏi tiếp theo
  window.nextQuestion = function() {
    // Nếu đang ở màn hình intro
    if (currentQuestion === 0) {
      introScreen.classList.add('hidden');
      questionsContainer.classList.remove('hidden');
    } else {
      // Ẩn câu hỏi hiện tại
      questions[currentQuestion - 1].classList.add('hidden');
    }

    // Lưu câu trả lời của câu trước (nếu có)
    if (currentQuestion > 0 && currentQuestion <= questions.length) {
      const prevQuestion = questions[currentQuestion - 1];
      const h2 = prevQuestion.querySelector('h2');
      const textarea = prevQuestion.querySelector('textarea');
      const selected = prevQuestion.querySelector('button.selected');

      let answer = "";
      if (textarea) answer = textarea.value.trim();
      else if (selected) answer = selected.innerText;

      if (answer) {
        recordAnswer(h2 ? h2.innerText : "Không rõ câu hỏi", answer);
      }
    }

    // Hiện câu tiếp theo
    if (currentQuestion < questions.length) {
      questions[currentQuestion].classList.remove('hidden');
      currentQuestion++;
    }
  }

  // 🧠 Khi người dùng chọn 1 nút (❤️, Có/Không,…)
  document.querySelectorAll('.question button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.target.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');
    });
  });

  // 🔐 Kiểm tra mật khẩu ở bước cuối
  window.checkPassword = function() {
    const passwordInput = document.getElementById('password-input');
    const feedbackMessage = document.getElementById('feedback-message');
    const input = passwordInput.value.trim();

    recordAnswer("Mật khẩu mở lời xin lỗi", input);

    if (input.toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
      questionsContainer.classList.add('hidden');
      apologyMessageScreen.classList.remove('hidden');

      recordAnswer("Kết quả mở khóa", "✅ Nhập đúng mật khẩu");

      // Gửi tất cả dữ liệu khi kết thúc
      sendAllToFormspree();
    } else {
      feedbackMessage.textContent = "Sai mật khẩu rồi, em thử lại nhé!";
      feedbackMessage.classList.remove('hidden');
      feedbackMessage.classList.remove('text-green-600');
      feedbackMessage.classList.add('text-red-600');

      recordAnswer("Kết quả mở khóa", "❌ Sai mật khẩu");
    }
  }
});

