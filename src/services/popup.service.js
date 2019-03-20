let popups = [];

const openPopup = (e, id) => {
    e.stopPropagation();
    if(popups.indexOf(id) === -1) {
        popups.push(id);
        let p = document.getElementById(id);
        let c = p.firstChild;
        if (p.offsetLeft < (c.offsetWidth / 2)) {
            p.style["justify-content"] = "flex-start";
        } else if ((p.firstElementChild.offsetWidth/2) + p.offsetLeft < p.parentElement.offsetWidth) {
            p.style["justify-content"] = "center";
        } else p.style["justify-content"] = "flex-end";
        c.classList.remove('action-popup-container--closed');
        c.classList.add('action-popup-container--open');
    } else {
        closePopup(id);
    }
};

const closePopup = id => {
    if (popups.indexOf(id) !== -1) {
        popups.splice(popups.indexOf(id), 1);
        let p = document.getElementById(id);
        try {
            let c = p.firstChild;
            c.classList.add('action-popup-container--closed');
            c.classList.remove('action-popup-container--open');
        } catch(e){}
    }
};

const closeAllPopups = () => {
    popups.map(p => {
        return closePopup(p);
    })
};

export {
    openPopup,
    closePopup,
    closeAllPopups
}