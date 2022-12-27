const block = {
    // code des touches Gauche, Haut, Droite et Bas
    keysAllowed: [37, 38, 39, 40],
    // variables globales
    numTour: 0,
    container: null,
    containerRect: null,
    containerExample: null,
    containerExampleRect: null,
    blocksUser: null,
    blockToMerge: null,
    blockToMergeRect: null,
    initialBlockUserTop: 0,
    initialBlockUserLeft: 0,
    initialBlockToMergeTop: 0,
    initialBlockToMergeLeft: 0,
    rotate: 0,
    canMoveBlock: true,

    /**
     * Initialisation
     */
    init: function() {
        // le container de l'exemple 
        block.containerExample = document.querySelector('.example-screen');
        // taille et position du container de l'exemple
        block.containerExampleRect = block.containerExample.getBoundingClientRect();
        // on créé l'exemple
        block.generateBlocksExamples();
        // le container du jeu
        block.container = document.querySelector('.game-screen');
        // taille et position du container du jeu 
        block.containerRect = block.container.getBoundingClientRect();
        block.initVariables();
        // on créé les divs de départ : le bloc pilotable, le bloc cible
        block.createDivs();
    },

    /**
     * 
     */
    initVariables: function() {
        block.initialBlockUserTop = "90px";
        block.initialBlockUserLeft = ((block.containerRect.width/2)-15) + "px";
        block.initialBlockToMergeTop = (block.containerRect.height - 120) + "px";
        block.initialBlockToMergeLeft = ((block.containerRect.width/2)-15) + "px"; 
    },

    /**
     * Créé les divs de départ du jeu
     * On le fait ici et pas dans le HTML car ça permet
     * de placer les divs toujours aux mêmes emplacements
     * par rapport à son container
     */
    createDivs: function() {
        // bloc pilotable
        const initBlockUser = document.createElement('div');
        initBlockUser.classList.add('blockUser');
        initBlockUser.style.top = block.initialBlockUserTop;
        initBlockUser.style.left = block.initialBlockUserLeft;
        block.container.append(initBlockUser);

        // bloc cible
        const initBlockToMerge = document.createElement('div');
        initBlockToMerge.classList.add('blockToMerge');
        initBlockToMerge.style.top = block.initialBlockToMergeTop;
        initBlockToMerge.style.left = block.initialBlockToMergeLeft; 
        block.container.append(initBlockToMerge);     
    },

    /**
     * Handler pour l'appui sur une touche
     * @param {*} event 
     */
    handleKeyDown: function(event) {
        // on récupère la touche pressée
        const key = event.keyCode;
        // on vérifie qu'on a bien appuyé sur une des flèches directionnelles
        if (block.keysAllowed.includes(key) && block.canMoveBlock) {
            // on récupère les blocs pilotable
            block.blocksUser = document.getElementsByClassName('blockUser');
            // on récupère aussi le bloc cible
            block.blockToMerge = document.querySelector('.blockToMerge');
            if (block.blockToMerge !== null) {
                // si le bloc cible existe bien, on récupère sa taille/position
                block.blockToMergeRect = block.blockToMerge.getBoundingClientRect();
            }

            if (key === 37) {block.moveLeft();} // appui sur Gauche
            else if (key === 38){block.moveUp();} // appui sur Haut
            else if (key === 39){block.moveRight();} // appui sur Droite
            else if (key === 40){block.moveDown();} // appui sur Bas
 
            // on vérifie si le bloc piotable touche un des bords du bloc cible
            if (block.getSideBlockInTouch()) { 
                // on bloque l'action sur l'appui des touches
                block.canMoveBlock = false;
                // c'est le cas
                // on va faire du bloc cible une partie du bloc pilotable :
                // on supprime la classe du bloc cible               
                block.blockToMerge.classList.remove('blockToMerge');
                // on lui ajoute la classe spécifique au bloc pilotable
                block.blockToMerge.classList.add('blockUser');

                // on génère un nouveau block cible
                const newBlock = document.createElement('div');
                // on lui donne la classe spécifique au bloc cible
                newBlock.classList.add('blockToMerge');

                if (block.isEven(block.numTour)) {
                    // le n° du tour de jeu est pair :
                    // on a donc mergé les blocs en bas de l'aire de jeu                    
                    // on recréé le bloc cible en haut
                    newBlock.style.top = block.initialBlockUserTop;
                    newBlock.style.left = block.initialBlockUserLeft;
                } else {
                    // le n° du tour de jeu est impair :
                    // on a donc mergé les blocs en haut de l'aire de jeu                    
                    // on recréé le bloc cible en bas
                    newBlock.style.top = block.initialBlockToMergeTop;
                    newBlock.style.left = block.initialBlockToMergeLeft;
                }
                // on ajoute le bloc au container
                block.container.append(newBlock);

                /* TEST ROTATION DU CONTAINER */
                //block.setVariableRotation(90);
                // on fait la rotation du container
                //block.container.style.transform = `rotate(${block.rotate}deg)`;
                // après l'animation, on débloque l'action sur l'appui des touches
                setTimeout(() => {
                    block.canMoveBlock = true;
                }, 1100);
                              
                // on incrémente le n° du tour
                block.numTour++;            
            }

            if (block.numTour == 14) {
                // dernier block mergé
                // faut vérifier que la forme finale correspond au dessin d'exemple
                console.log('STOP');
            }
        }
    },

    /**
     * 
     * @param {string} direction 
     * @returns TRUE si on peut bouger, FALSE sinon
     */
    checkCanMove: function(direction) {
        let canMove = true;
        for (blockUser of block.blocksUser) {
            const blockUserRect = blockUser.getBoundingClientRect();
            const containerRect = block.container.getBoundingClientRect();
            if (   (direction == 'L' && block.rotate == 0)
                || (direction == 'R' && block.rotate == 180)
                || (direction == 'U' && block.rotate == 270)
                || (direction == 'D' && block.rotate == 90)
               ) {
                canMove = (blockUserRect.left > containerRect.left);
            } else if (   (direction == 'L' && block.rotate == 90)
                       || (direction == 'R' && block.rotate == 270)
                       || (direction == 'U' && block.rotate == 0)
                       || (direction == 'D' && block.rotate == 180)
               ) {
                canMove = (blockUserRect.top > containerRect.top);
            } else if (   (direction == 'L' && block.rotate == 180)
                       || (direction == 'R' && block.rotate == 0)
                       || (direction == 'U' && block.rotate == 90)
                       || (direction == 'D' && block.rotate == 270)
               ) {
                canMove = ((blockUserRect.left + blockUserRect.width) < (containerRect.left + block.containerRect.width));
            } else if (   (direction == 'L' && block.rotate == 270)
                       || (direction == 'R' && block.rotate == 90)
                       || (direction == 'U' && block.rotate == 180)
                       || (direction == 'D' && block.rotate == 0)
               ) {
                canMove = ((blockUserRect.top + blockUserRect.height) < (containerRect.top + block.containerRect.height));
            }
            if (!canMove) {
                break;
            }
        }
        return canMove;
    },

    /**
     * Bouge le tas de blocs pilotable vers la gauche
     * @returns 
     */
    moveLeft: function() {
        if (block.checkCanMove('L')) {
            for (blockUser of block.blocksUser) {
                const blockUserRect = blockUser.getBoundingClientRect();
                const left = blockUser.offsetLeft - blockUserRect.width;
                blockUser.style.left = left + "px";
            }            
        }
    },

    /**
     * Bouge le tas de blocs pilotable vers la droite
     * @returns 
     */    
    moveRight: function() {
        if (block.checkCanMove('R')) {
            for (blockUser of block.blocksUser) {
                const blockUserRect = blockUser.getBoundingClientRect();
                const left = blockUser.offsetLeft + blockUserRect.width;
                blockUser.style.left = left + "px";
            }            
        }
    },    

    /**
     * Bouge le tas de blocs pilotable vers le haut
     * @returns 
     */    
    moveUp: function() {
        if (block.checkCanMove('U')) {
            for (blockUser of block.blocksUser) {
                const blockUserRect = blockUser.getBoundingClientRect();                    
                const up = blockUser.offsetTop - blockUserRect.height;
                blockUser.style.top = up + "px";                       
            }            
        }
    },   
    
    /**
     * Bouge le tas de blocs pilotable vers le bas
     * @returns 
     */
    moveDown: function() {
        if (block.checkCanMove('D')) {
            for (blockUser of block.blocksUser) {
                const blockUserRect = blockUser.getBoundingClientRect(); 
                const up = blockUser.offsetTop + blockUserRect.height;
                blockUser.style.top = up + "px";                
            }            
        }
    },

    /**
     * Vérifie si le groupe de blocs pilotables touche le bloc cible sur un des côtés
     * @returns 
     */
    getSideBlockInTouch: function() {
        let isInTouch = false;
        for (blockUser of block.blocksUser) {
            const blockUserRect = blockUser.getBoundingClientRect(); 

            if (   blockUserRect.left == (block.blockToMergeRect.left + block.blockToMergeRect.width)
                && blockUserRect.top == block.blockToMergeRect.top
            ) {
                isInTouch = true;
            } else if (   blockUserRect.left == block.blockToMergeRect.left
                    && (blockUserRect.top + blockUserRect.height) == block.blockToMergeRect.top
                     ) {
                isInTouch = true;
            } else if (   (blockUserRect.left + blockUserRect.width) == block.blockToMergeRect.left
                    && blockUserRect.top == block.blockToMergeRect.top
                     ) {
                isInTouch = true;
            } else if (   blockUserRect.top == (block.blockToMergeRect.top + block.blockToMergeRect.height)
                    && blockUserRect.left == block.blockToMergeRect.left
                     ) {
                isInTouch = true;
            } 
        }
        
        return isInTouch;
    },

    /**
     * Check si un nombre donné est pair
     * @param {int} number 
     * @returns TRUE si nombre pair, FALSE sinon
     */
    isEven: function(number) {
        return (number % 2 == 0);
    },

    /**
     * 
     */
    generateBlocksExamples: function() {
        // on va générer 10 blocks
        // on génère le 1er block au centre du container
        let div = document.createElement('div');
        div.classList.add('blockExample');
        div.style.left = (block.containerExampleRect.left + ((block.containerExampleRect.width/2)-15)) + "px"; 
        div.style.top = (block.containerExampleRect.top + ((block.containerExampleRect.height/2)-15)) + "px"; 
        //div.textContent = 1;
        block.containerExample.append(div);
        let divRect = div.getBoundingClientRect();
        let blockLeft = divRect.left;
        let blockTop = divRect.top;
        let direction = "";
        for (let i = 0; i < 14; i++) {
            let divSupp = document.createElement('div');
            divSupp.classList.add('wip');
            direction = block.positionneBlockExample(divSupp, direction, blockLeft, blockTop);
            divSupp.classList.remove('wip');
            divSupp.classList.add('blockExample');
            //divSupp.textContent = i+2;
            block.containerExample.append(divSupp);
            divRect = divSupp.getBoundingClientRect();
            blockLeft = divRect.left;
            blockTop = divRect.top;
            
        }
    },

    /**
     * 
     * @param {*} divBlock 
     * @param {*} direction 
     * @param {*} blockLeft 
     * @param {*} blockTop 
     * @returns 
     */
    positionneBlockExample: function(divBlock, direction, blockLeft, blockTop) {
        direction = block.getDirectionNewBlock(direction);
        if (direction == 'E') {
            divBlock.style.left = (blockLeft + 30) + "px";
            divBlock.style.top = blockTop + "px";
        } else if (direction == 'O') {
            divBlock.style.left = (blockLeft - 30) + "px";
            divBlock.style.top = blockTop + "px";
        } else if (direction == 'N') {
            divBlock.style.left = blockLeft + "px";
            divBlock.style.top = (blockTop - 30) + "px";
        } else if (direction == 'S') {
            divBlock.style.left = blockLeft + "px";
            divBlock.style.top = (blockTop + 30) + "px";
        }

        const blocksPositionned = document.getElementsByClassName('blockExample');
        for (const oneBlock of blocksPositionned) {
            if (oneBlock.style.left == divBlock.style.left && oneBlock.style.top == divBlock.style.top) {
                block.positionneBlockExample(divBlock, direction, blockLeft, blockTop);
            }
        }

        return direction;
    },

    /**
     * 
     * @param {string} previousDirection 
     * @returns 
     */
    getDirectionNewBlock: function(previousDirection) {
        // tableau qui contient les directions et leur contraire
        const directions = {'E': 'O', 'O': 'E', 'N': 'S', 'S': 'N'};
        let listDirections = [];
        for (const direction in directions) {
            if (directions[direction] !== previousDirection) {
                listDirections.push(direction);
            }
        }

        return listDirections[Math.floor(Math.random() * listDirections.length)];
    },

    /**
     * 
     * @param {int} angle 
     */
    setVariableRotation: function(angle) {
        block.rotate += angle;
        if (block.rotate > 360) {
            block.rotate = 90;
        }
    },
}