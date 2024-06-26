const pages = [
    'page1.html',
    'page2.html',
    'page3.html',
    // Add more page URLs as needed
];

let currentPageIndex = 0;

const previousBtn = document.getElementById('previousBtn');
const nextBtn = document.getElementById('nextBtn');

previousBtn.addEventListener('click', () => {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        window.location.href = pages[currentPageIndex];
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPageIndex < pages.length - 1) {
        currentPageIndex++;
        window.location.href = pages[currentPageIndex];
    }
});
