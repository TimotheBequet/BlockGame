const block = {
    keysAllowed: [37, 38, 39, 40],

    containerRect: null,
    blockUser: null,
    blockUserRect: null, 
    blockToMerge: null,
    blockToMergeRect: null,

    handleKeyDown: function(event) {
        block.containerRect = document.querySelector('.container').getBoundingClientRect();

        block.blockUser = document.querySelector('.blockUser');
        block.blockUserRect = block.blockUser.getBoundingClientRect();

        block.blockToMerge = document.querySelector('.blockToMerge');
        block.blockToMergeRect = block.blockToMerge.getBoundingClientRect();
 
        const key = event.keyCode;
        if (block.keysAllowed.includes(key)) {
            if (key === 37) {block.moveLeft();}
            else if (key === 38){block.moveUp();}
            else if (key === 39){block.moveRight();}
            else if (key === 40){block.moveDown();}


        }
    },

    moveLeft: function() {
        if (block.blockUserRect.x > block.containerRect.x) {
            const left = block.blockUserRect.x - block.blockUserRect.width;
            block.blockUser.style.left = left + "px";
        }
    },

    moveRight: function() {
        if ((block.blockUserRect.x + block.blockUserRect.width) < (block.containerRect.x + block.containerRect.width)) {
            const left = block.blockUserRect.x + block.blockUserRect.width;
            block.blockUser.style.left = left + "px";
        }
    },    

    moveUp: function() {
        if (block.blockUserRect.y > block.containerRect.y) {
            const up = block.blockUserRect.y - block.blockUserRect.height;
            block.blockUser.style.top = up + "px";
        }
    },   
    
    moveDown: function() {
        if ((block.blockUserRect.y + block.blockUserRect.height) < (block.containerRect.y + block.containerRect.height)) {
            const up = block.blockUserRect.y + block.blockUserRect.height;
            block.blockUser.style.top = up + "px";
        }
    },
    
    getSideBlockInTouch: function() {

    },
   
}