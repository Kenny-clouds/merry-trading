// 梅睿贸易 - 导航 & 交互脚本
document.addEventListener('DOMContentLoaded', () => {
    // 导航滚动阴影
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 30);
        });
    }
});
