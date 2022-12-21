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
    initialBlockUserRect: null,
    initialBlockToMergeRect: null,

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
        // on créé les divs de départ : le bloc pilotable, le bloc cible
        block.createDivs();
        // on sauve la taille/position des blocs de départ
        block.initialBlockUserRect = document.querySelector('.blockUser').getBoundingClientRect();
        block.initialBlockToMergeRect = document.querySelector('.blockToMerge').getBoundingClientRect();
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
        initBlockUser.style.top = (block.containerRect.top + 60) + "px";
        initBlockUser.style.left = (block.containerRect.left + ((block.containerRect.width/2)-15)) + "px";
        block.container.append(initBlockUser);

        // bloc cible
        const initBlockToMerge = document.createElement('div');
        initBlockToMerge.classList.add('blockToMerge');
        initBlockToMerge.style.top = ((block.containerRect.top + block.containerRect.height) - 90) + "px";
        initBlockToMerge.style.left = (block.containerRect.left + ((block.containerRect.width/2)-15)) + "px"; 
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
        if (block.keysAllowed.includes(key)) {

            // on récupère le bloc pilotable
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
                // c'est le cas
                // on va faire du bloc cible une partie du bloc pilotable :
                // on supprime la classe du bloc cible               
                block.blockToMerge.classList.remove('blockToMerge');
                // on lui ajoute la classe spécifique au bloc pilotable
                block.blockToMerge.classList.add('blockUser');
                // on lui remet sa position d'origine (à priori pas besoin de le faire)
                /*block.blockToMerge.style.left = block.blockToMergeRect.left + "px";
                block.blockToMerge.style.top = block.blockToMergeRect.top + "px";*/

                // on génère un nouveau block cible
                const newBlock = document.createElement('div');
                // on lui donne la classe spécifique au bloc cible
                newBlock.classList.add('blockToMerge');

                if (block.isEven(block.numTour)) {
                    // le n° du tour de jeu est pair :
                    // on a donc mergé les blocs en bas de l'aire de jeu                    
                    // on recréé le bloc cible en haut
                    newBlock.style.top = block.initialBlockUserRect.top + "px";
                    newBlock.style.left = block.initialBlockUserRect.left + "px";
                } else {
                    // le n° du tour de jeu est impair :
                    // on a donc mergé les blocs en haut de l'aire de jeu                    
                    // on recréé le bloc cible en bas
                    newBlock.style.top = block.initialBlockToMergeRect.top + "px";
                    newBlock.style.left = block.initialBlockToMergeRect.left + "px";
                }
                // on ajoute le bloc au container
                block.container.append(newBlock);
                // on incrémente le n° du tour
                block.numTour++;            
            }
        }
    },

    /**
     * Bouge le tas de blocs pilotable vers la gauche
     * @returns 
     */
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

    /**
     * Bouge le tas de blocs pilotable vers la droite
     * @returns 
     */    
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

    /**
     * Bouge le tas de blocs pilotable vers le haut
     * @returns 
     */    
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
    
    /**
     * Bouge le tas de blocs pilotable vers le bas
     * @returns 
     */
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

    /**
     * Vérifie si le groupe de blocs pilotables touche le bloc cible sur un des côtés
     * @returns 
     */
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

    generateBlocksExamples: function() {
        // on va générer 10 blocks
        // on génère le 1er block au centre du container
        const div = document.createElement('div');
        div.classList.add('blockExample');
        div.style.left = (block.containerExampleRect.left + ((block.containerExampleRect.width/2)-15)) + "px"; 
        div.style.top = (block.containerExampleRect.top + ((block.containerExampleRect.height/2)-15)) + "px"; 
        block.containerExample.append(div);
        for (const i = 0; i < 10; i++) {
            const divSupp = document.createElement('div');
            divSupp.classList.add('blockExample');
            div.style.left = (block.containerRect.left + ((block.containerRect.width/2)-15)) + "px";
        }
    },

    getDirectionNewBlock: function(previousDirection) {
        // tableau qui contien les directions et leur contraire
        const directions = {'E': 'O', 'O': 'E', 'N': 'S', 'S': 'N'};
        for (const direction in directions) {
            if (directions[direction] === previousDirection) {
                directions.delete(direction);
                return;
            }
        }
    }
   
}