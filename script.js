document.addEventListener('DOMContentLoaded', () => {
    const textArea = document.getElementById('textArea');
    const remainingChars = document.getElementById('remainingChars');
    const timerSelect = document.getElementById('timerSelect');
    const startTimerBtn = document.getElementById('startTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    const saveButton = document.getElementById('saveButton');
    const emotionSelect = document.getElementById('emotionSelect');
    const maxLength = 3000;
    let timer;
    let isRunning = false;

    // 保存完了のメッセージを表示する関数
    function showSaveMessage() {
        const saveMessage = document.getElementById('saveMessage');
        saveMessage.classList.add('show');
        
        // 2秒後にフェードアウト
        setTimeout(() => {
            saveMessage.classList.remove('show');
            saveMessage.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                saveMessage.style.animation = '';
            }, 500);
        }, 2000);
    }

    // 保存機能
    function saveEntry() {
        const entry = {
            emotion: emotionSelect.options[emotionSelect.selectedIndex].text,
            text: textArea.value,
            timestamp: new Date().toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        // localStorageに保存
        let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        entries.push(entry);
        localStorage.setItem('journalEntries', JSON.stringify(entries));

        // 保存完了メッセージを表示
        showSaveMessage();
        
        // テキストエリアをクリア
        textArea.value = '';
        updateRemainingChars();

        // 保存されたエントリを表示
        displayEntries();
    }

    // 保存ボタンのクリックイベント
    saveButton.addEventListener('click', saveEntry);

    // 保存されたエントリを表示する関数
    function displayEntries() {
        const entriesList = document.getElementById('entriesList');
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        
        // 最新のエントリから表示
        entriesList.innerHTML = entries.map(entry => `
            <div class="entry-item">
                <div class="entry-header">
                    <div class="entry-emotion">${entry.emotion}</div>
                    <div class="entry-timestamp">${entry.timestamp}</div>
                </div>
                <div class="entry-content">${entry.text}</div>
            </div>
        `).join('');
    }

    // ページ読み込み時に保存されたエントリを表示
    displayEntries();

    // タイマーを開始する関数
    function startTimer() {
        if (isRunning) return;

        const selectedTime = parseInt(timerSelect.value);
        let remainingTime = selectedTime;
        
        timerDisplay.textContent = formatTime(remainingTime);
        
        timer = setInterval(() => {
            remainingTime--;
            timerDisplay.textContent = formatTime(remainingTime);
            
            if (remainingTime <= 0) {
                stopTimer();
                alert('タイマーが終了しました！');
            }
        }, 1000);
        
        isRunning = true;
        startTimerBtn.textContent = '停止';
    }

    // タイマーを停止する関数
    function stopTimer() {
        if (!isRunning) return;
        
        clearInterval(timer);
        isRunning = false;
        startTimerBtn.textContent = '開始';
    }

    // 時間を分:秒の形式にフォーマットする関数
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // 開始/停止ボタンのクリックイベント
    startTimerBtn.addEventListener('click', () => {
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    // デフォルトで5分に設定
    timerSelect.value = '300';
    timerDisplay.textContent = formatTime(300);

    // 残り文字数を更新する関数
    function updateRemainingChars() {
        const currentLength = textArea.value.length;
        const remaining = maxLength - currentLength;
        remainingChars.textContent = remaining;
    }

    // テキストエリアの入力イベントを監視
    textArea.addEventListener('input', updateRemainingChars);

    // 初期表示時に残り文字数を更新
    updateRemainingChars();

    // テキストエリアの高さを自動調整する関数
    function autoResize() {
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight + 'px';
    }

    // テキストエリアの入力イベントを監視して高さを調整
    textArea.addEventListener('input', autoResize);
    
    // 初期表示時に高さを調整
    autoResize();
});
