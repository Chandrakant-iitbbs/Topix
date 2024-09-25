const getStars = (questionsAnswered,totalLikes, questionsAsked) => {
    let n = 1 + 1.7 * (questionsAnswered / (10 + questionsAnswered)) + 1.3 * (totalLikes / (50 + totalLikes)) + (questionsAsked / (20 + questionsAsked));
    n = Math.round(n);
    let stars = "";
    for (let i = 0; i < n; i++) {
        stars += "⭐";
    }
    return stars;
};
module.exports = { getStars };