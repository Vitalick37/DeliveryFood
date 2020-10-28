'use strict'

window.disableScroll = () => {

    let widthScroll = window.innerWidth - document.body.offsetWidth;

    document.body.dataScrollY = window.scrollY;       //позиция страницы по вертикали

    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        overflow: hidden;
        height: 100vh;
        padding-right: ${widthScroll}px;
    `;
};

window.enableScroll = () => {
    document.body.style.cssText = ``;
    window.scroll({top: document.body.dataScrollY});
};