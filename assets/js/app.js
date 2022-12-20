const app = {
    init: function() {
        document.addEventListener('keydown', block.handleKeyDown);
    },
}

document.addEventListener('DOMContentLoaded', app.init);