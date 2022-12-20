const block = {
    keysAllowed: [37, 38, 39, 40],

    numTour: 0,
    container: null,
    containerRect: null,
    blocksUser: null,
    blockToMerge: null,
    blockToMergeRect: null,
    initialBlockUserRect: null,
    initialBlockToMergeRect: null,

    init: function() {

        block.container = document.querySelector('.game-screen');
        block.containerRect = document.querySelector('.game-screen').getBoundingClientRect();

        block.createDivs();
        
        block.initialBlockUserRect = document.querySelector('.blockUser').getBoundingClientRect();
        block.initialBlockToMergeRect = document.querySelector('.blockToMerge').getBoundingClientRect();
    },

    createDivs: function() {
        const initBlockUser = document.createElement('div');
        initBlockUser.classList.add('blockUser');
        initBlockUser.style.top = (block.containerRect.top + 60) + "px";
        initBlockUser.style.left = (block.containerRect.left + ((block.containerRect.width/2)-15)) + "px";
        block.container.append(initBlockUser);

        const initBlockToMerge = document.createElement('div');
        initBlockToMerge.classList.add('blockToMerge');
        initBlockToMerge.style.top = ((block.containerRect.top + block.containerRect.height) - 90) + "px";
        initBlockToMerge.style.left = (block.containerRect.left + ((block.containerRect.width/2)-15)) + "px"; 
        block.container.append(initBlockToMerge);     
    },

    handleKeyDown: function(event) {
        block.blocksUser = document.getElementsByClassName('blockUser');

        block.blockToMerge = document.querySelector('.blockToMerge');
        if (block.blockToMerge !== null) {
            block.blockToMergeRect = block.blockToMerge.getBoundingClientRect();
        }
 
        const key = event.keyCode;
        if (block.keysAllowed.includes(key)) {
            if (key === 37) {block.moveLeft();}
            else if (key === 38){block.moveUp();}
            else if (key === 39){block.moveRight();}
            else if (key === 40){block.moveDown();}

            if (block.getSideBlockInTouch()) {                
                block.blockToMerge.classList.remove('blockToMerge');
                block.blockToMerge.classList.add('blockUser');
                block.blockToMerge.style.left = block.blockToMergeRect.left + "px";
                block.blockToMerge.style.top = block.blockToMergeRect.top + "px";

                // on génère un nouveau block
                const newBlock = document.createElement('div');
                newBlock.classList.add('blockToMerge');
                if (block.isEven(block.numTour)) {
                    // on recréé la div en haut
                    newBlock.style.top = block.initialBlockUserRect.top + "px";
                    newBlock.style.left = block.initialBlockUserRect.left + "px";
                } else {
                    // on recréé la div en bas
                    newBlock.style.top = block.initialBlockToMergeRect.top + "px";
                    newBlock.style.left = block.initialBlockToMergeRect.left + "px";
                }

                block.container.append(newBlock);

                block.numTour++;
            }
        }
    },

    moveLeft: function() {
        let canMove = true;
        for (blockUser of block.blocksUser) {
            blockUserRect = blockUser.getBoundingClientRect();
            if (blockUserRect.left <= block.containerRect.left) {
                canMove = false;
                return;
            }
        }

        if (canMove) {
            for (blockUser of block.blocksUser) {
                blockUserRect = blockUser.getBoundingClientRect();
                const left = blockUserRect.left - blockUserRect.width + "px";
                blockUser.style.left = left;
            }            
        }
    },

    moveRight: function() {
        let canMove = true;
        for (blockUser of block.blocksUser) {
            blockUserRect = blockUser.getBoundingClientRect();
            if ((blockUserRect.left + blockUserRect.width) >= (block.containerRect.left + block.containerRect.width)) {
                canMove = false;
                return;
            }
        }

        if (canMove) {
            for (blockUser of block.blocksUser) {
                blockUserRect = blockUser.getBoundingClientRect();
                const left = blockUserRect.left + blockUserRect.width;
                blockUser.style.left = left + "px";
            }            
        }
    },    

    moveUp: function() {
        let canMove = true;
        for (blockUser of block.blocksUser) {
            blockUserRect = blockUser.getBoundingClientRect();        
            if (blockUserRect.top <= block.containerRect.top) {
                canMove = false;
                return;
            }
        }

        if (canMove) {
            for (blockUser of block.blocksUser) {
                blockUserRect = blockUser.getBoundingClientRect();                     
                const up = blockUserRect.top - blockUserRect.height + "px";
                blockUser.style.top = up;                            
            }            
        }
    },   
    
    moveDown: function() {
        let canMove = true;
        // on regarde d'abord s'il y a une div qui risque de sortir du cadre
        for (blockUser of block.blocksUser) {
            blockUserRect = blockUser.getBoundingClientRect(); 
            if ((blockUserRect.top + blockUserRect.height) >= (block.containerRect.top + block.containerRect.height)) {
                canMove = false;
                return;
            }
        }

        if (canMove) {
            for (blockUser of block.blocksUser) {
                blockUserRect = blockUser.getBoundingClientRect(); 
                const up = blockUserRect.top + blockUserRect.height;
                blockUser.style.top = up + "px";                
            }            
        }
    },

    getSideBlockInTouch: function() {
        let isInTouch = false;
        for (blockUser of block.blocksUser) {
            blockUserRect = blockUser.getBoundingClientRect(); 

            if (   blockUserRect.left == (block.blockToMergeRect.left + block.blockToMergeRect.width)
                && blockUserRect.top == block.blockToMergeRect.top
            ) {
                console.log('ça touche à droite');
                isInTouch = true;
            } else if (   blockUserRect.left == block.blockToMergeRect.left
                    && (blockUserRect.top + blockUserRect.height) == block.blockToMergeRect.top
                     ) {
                console.log('ça touche en haut');
                isInTouch = true;
            } else if (   (blockUserRect.left + blockUserRect.width) == block.blockToMergeRect.left
                    && blockUserRect.top == block.blockToMergeRect.top
                     ) {
                console.log('ça touche à gauche');
                isInTouch = true;
            } else if (   blockUserRect.top == (block.blockToMergeRect.top + block.blockToMergeRect.height)
                    && blockUserRect.left == block.blockToMergeRect.left
                     ) {
                console.log('ça touche en bas');
                isInTouch = true;
            } 
        }
        
        return isInTouch;
    },

    /**
     * Check si un nombre donné est pair
     * @param {*} number 
     * @returns TRUE si nombre pair, FALSE sinon
     */
    isEven: function(number) {
        return (number % 2 == 0);
    },
   
}