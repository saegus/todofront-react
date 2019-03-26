let modals = [];

const openModal = (e, id) => {
    if(modals.indexOf(id) === -1) {
        modals.push(id);
        let m = document.getElementById(id);
        m.style.display = 'flex';
    } else {
        closeModal(id);
    }
};

const closeModal = (id) => {
    if(modals.indexOf(id) !== -1) {
        let m = document.getElementById(id);
        m.style.display = 'none';
        modals.splice(modals.indexOf(id), 1);
    }
};

const closeAllModals = () => {
    modals.map(m => {
        return closeModal(m);
    })
};

export {
    openModal,
    closeModal,
    closeAllModals
}