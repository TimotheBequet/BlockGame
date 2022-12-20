const app = {
    init: function() {
        block.init();
        document.addEventListener('keydown', block.handleKeyDown);
    },
}

document.addEventListener('DOMContentLoaded', app.init);