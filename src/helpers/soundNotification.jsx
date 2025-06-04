export const playNotificationSound = () => {
    const audio = new Audio('/src/asserts/svg/yasuo_hasaki.mp3');
    audio.play().catch((err) => {
        console.log("Audio play failed:", err);
    });
};
