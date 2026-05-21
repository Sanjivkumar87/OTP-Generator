// --- Sounds ---
const clickSound = new Audio('11325622-vinyl-stop-sound-effect-241388.mp3');
const successSound = new Audio('sound.mp3');
const ambientHum = new Audio('');
ambientHum.loop = true;
ambientHum.volume = 0.15;

let isMuted = false;
let timerInterval;

function toggleMute() {
    isMuted = !isMuted;
    const icon = document.getElementById('mute-icon');
    if (isMuted) {
        icon.className = 'fa-solid fa-volume-xmark';
        ambientHum.pause();
    } else {
        icon.className = 'fa-solid fa-volume-high';
        if (timerInterval) ambientHum.play();
    }
}

function generateOTP() {
    if (!isMuted) ambientHum.play().catch(() => {});
    if (!isMuted) { clickSound.currentTime = 0; clickSound.play(); }

    const otpDisplay = document.getElementById('otp-display');
    const timerBar = document.getElementById('timer-bar');
    const timerText = document.getElementById('timer-text');
    const copyBtn = document.getElementById('copy-btn');

    let iterations = 0;
    const scramble = setInterval(() => {
        otpDisplay.innerText = Math.floor(100000 + Math.random() * 900000);
        iterations++;
        if (iterations > 12) {
            clearInterval(scramble);
            finalizeOTP();
        }
    }, 50);

    function finalizeOTP() {
        if (!isMuted) successSound.play();
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpDisplay.innerText = otp;
        copyBtn.classList.remove('d-none');

        clearInterval(timerInterval);
        let timeLeft = 30;
        timerBar.style.width = '100%';

        timerInterval = setInterval(() => {
            timeLeft--;
            timerBar.style.width = `${(timeLeft / 30) * 100}%`;
            timerText.innerText = `SESSION_STABILITY: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                otpDisplay.innerText = '------';
                timerText.innerText = 'ACCESS_EXPIRED. RE-GENERATE.';
                copyBtn.classList.add('d-none');
            }
        }, 1000);
    }
}

function copyOTP() {
    const otp = document.getElementById('otp-display').innerText;
    if (otp === '------') return;
    navigator.clipboard.writeText(otp);
    
    const msg = document.createElement('div');
    msg.className = 'copy-success show';
    msg.innerText = 'BUFFER_COPIED';
    document.body.appendChild(msg);
    setTimeout(() => { msg.remove(); }, 2000);
}

