const app = {
    init: function() {
        document.body.style.minWidth = screen.width + "px";
        block.init();
        document.addEventListener('keydown', block.handleKeyDown);
    },
}

document.addEventListener('DOMContentLoaded', app.init);