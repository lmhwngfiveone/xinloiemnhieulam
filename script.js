document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const retryMessage = document.getElementById('retryMessage');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const fireworksContainer = document.querySelector('.fireworks-container');
    const question = document.querySelector('.question');
    const title = document.querySelector('h1');
    const buttonsDiv = document.querySelector('.buttons');

    // **THAY THẾ ĐƯỜNG LINK NÀY BẰNG ENDPOINT URL CỦA FORMSPREE CỦA BẠN**
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqabdvlg'; 
    // Ví dụ: const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mleazwqa';

    let heartsInterval;
    let bubblesInterval;

    // Hàm gửi dữ liệu đến Formspree
    async function sendChoiceToFormspree(choice) {
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Quan trọng để nhận phản hồi JSON từ Formspree
                },
                body: JSON.stringify({
                    'lựa chọn': choice, // Tên trường bạn muốn thấy trong email
                    'thời gian': new Date().toLocaleString() // Thêm thời gian lựa chọn
                })
            });

            if (response.ok) {
                console.log('Lựa chọn đã được gửi thành công!');
                // Bạn có thể thêm xử lý thành công ở đây nếu muốn
            } else {
                console.error('Có lỗi khi gửi lựa chọn:', response.statusText);
                // Xử lý lỗi nếu cần
            }
        } catch (error) {
            console.error('Lỗi mạng hoặc lỗi khác:', error);
        }
    }


    // Xử lý khi nhấn nút "Không"
    noBtn.addEventListener('click', () => {
        // Gửi lựa chọn "Không" đến Formspree
        sendChoiceToFormspree('Không');

        // Hiện thông báo "Vui lòng chọn lại"
        retryMessage.classList.remove('hidden');

        // Làm nút "Có" lớn hơn
        let currentYesFontSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
        yesBtn.style.fontSize = (currentYesFontSize * 1.2) + 'px';
        yesBtn.style.padding = (parseFloat(window.getComputedStyle(yesBtn).paddingTop) * 1.2) + 'px ' + (parseFloat(window.getComputedStyle(yesBtn).paddingLeft) * 1.2) + 'px';
    });

    // Xử lý khi nhấn nút "Có"
    yesBtn.addEventListener('click', () => {
        // Gửi lựa chọn "Có" đến Formspree
        sendChoiceToFormspree('Có');

        // Ẩn tất cả các phần tử khác
        question.classList.add('hidden');
        buttonsDiv.classList.add('hidden');
        retryMessage.classList.add('hidden');
        title.classList.add('hidden');

        // Hiện thông báo "Cảm ơn"
        thankYouMessage.classList.remove('hidden');

        // Bắt đầu tạo hiệu ứng trái tim và bong bóng
        startLoveEffects();
    });

    // Hàm bắt đầu hiệu ứng trái tim rơi và bong bóng bay
    function startLoveEffects() {
        clearInterval(heartsInterval);
        clearInterval(bubblesInterval);

        heartsInterval = setInterval(() => {
            createFallingHeart();
        }, 200);

        bubblesInterval = setInterval(() => {
            createBubble();
        }, 150);
    }

    // Hàm tạo trái tim rơi
    function createFallingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        fireworksContainer.appendChild(heart);

        const size = Math.random() * 25 + 15;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${Math.random() * 3 + 2}s`;
        heart.style.animationDelay = `${Math.random() * 0.5}s`;

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    // Hàm tạo bong bóng bay lên
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        fireworksContainer.appendChild(bubble);

        const size = Math.random() * 30 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.bottom = `-50px`;

        const translateXEnd = (Math.random() - 0.5) * 200;
        bubble.style.setProperty('--translateX-end', `${translateXEnd}px`);

        bubble.style.animationDuration = `${Math.random() * 5 + 3}s`;
        bubble.style.animationDelay = `${Math.random() * 0.5}s`;

        bubble.addEventListener('animationend', () => {
            bubble.remove();
        });
    }
});