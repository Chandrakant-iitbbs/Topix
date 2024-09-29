const contactNamebyId = (contacts, senderId) => {
    const contact = contacts.find(contact => contact.chatId === senderId);
    if (!contact) return senderId;
    return contact.name ? contact.name : senderId;
}

module.exports = { contactNamebyId };
