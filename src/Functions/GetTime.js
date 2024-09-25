const getTimeDifference = (date) => {
    const currentDate = new Date();
    const askDate = new Date(date);
    let diffTime = currentDate - askDate;

    const yrs = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    if (yrs > 0) {
        return `${yrs} years ago`;
    }
    diffTime -= yrs * (1000 * 60 * 60 * 24 * 365);
    const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    if (months > 0) {
        return `${months} months ago`;
    }
    diffTime -= months * (1000 * 60 * 60 * 24 * 30);

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (days > 0) {
        return `${days} days ago`;
    }
    diffTime -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    if (hours > 0) {
        return `${hours} hours ago`;
    }

    diffTime -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diffTime / (1000 * 60));
    if (minutes > 0) {
        return `${minutes} minutes ago`;
    }
    diffTime -= minutes * (1000 * 60);
    const seconds = Math.ceil(diffTime / 1000);
    return `${seconds} seconds ago`;
};

const getMembershipTime = (date) => {
    const currentDate = new Date();
    const membershipDate = new Date(date);
    let diffTime = Math.abs(currentDate - membershipDate);
    const yrs = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    diffTime -= yrs * (1000 * 60 * 60 * 24 * 365);
    const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    diffTime -= months * (1000 * 60 * 60 * 24 * 30);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let membership = "";
    if (yrs > 0) {
      membership += `${yrs} years `;
    }
    if (months > 0) {
      membership += `${months} months `;
    }
    if (days > 0) {
      membership += `${days} days `;
    }
    return membership;
  };

module.exports = { getTimeDifference, getMembershipTime };    