import PositionElements from './positionElements.js';

class DragDrop {
    constructor() {
        this.positionElements = new PositionElements();
        this.selected = null;
        this.points = { correct: 0, wrong: 0 };

        this.dragDropEvents();
        this.imageChange();
    }

    // ---------------------------
    // ÉVÉNEMENTS DRAG & DROP
    // ---------------------------
    dragDropEvents() {
        const { draggableDivs, puzzleDivs } = this.positionElements.elements;

        draggableDivs.forEach(draggableDiv => {
            draggableDiv.addEventListener('dragstart', (e) => this.onDragStart(e));
        });

        puzzleDivs.forEach((puzzleDiv, i) => {
            puzzleDiv.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            puzzleDiv.addEventListener('drop', () => {
                puzzleDiv.classList.remove("active");
                this.onDrop(i);
            });
            puzzleDiv.addEventListener('dragenter', () => puzzleDiv.classList.add("active"));
            puzzleDiv.addEventListener('dragleave', () => puzzleDiv.classList.remove("active"));
        });
    }

    onDragStart(e) {
        this.selected = e.target;
    }

    onDrop(index) {
        const { puzzleDivs } = this.positionElements.elements;

        if (puzzleDivs[index].children.length === 0) {
            this.selected.style.top = '0';
            this.selected.style.left = '0';
            this.selected.style.border = 'none';
            puzzleDivs[index].append(this.selected);

            if (Number(this.selected.dataset.index) === index) {
                this.points.correct++;
                this.selected.classList.add("correct-piece");
            } else {
                this.points.wrong++;
                this.selected.classList.add("wrong-piece");
            }

            this.checkGameState();
        }
    }

    // ---------------------------
    // VÉRIFICATION ÉTAT DU JEU
    // ---------------------------
    checkGameState() {
        const { puzzleDivs, modal, modalText, modalBtn, cellsAmount } = this.positionElements.elements;

        // ✅ Victoire
        if (this.points.correct === cellsAmount) {
            this.showModal(
                modal,
                modalText,
                modalBtn,
                `🎉 VICTOIRE ! 🎉\n\nBravo, vous avez terminé le puzzle.\n\n✅ Pièces correctes : ${this.points.correct}\n❌ Erreurs : ${this.points.wrong}`
            );
            return;
        }

        // ❌ Défaite
        if (!puzzleDivs.some(div => !div.firstElementChild) && this.points.correct < cellsAmount) {
            this.showModal(
                modal,
                modalText,
                modalBtn,
                `😢 DÉFAITE 😢\n\nLe puzzle est terminé, mais certaines pièces ne sont pas à leur place.\n\n✅ Pièces correctes : ${this.points.correct}\n❌ Erreurs : ${this.points.wrong}\n\nCliquez sur "Rejouer" pour recommencer.`
            );
        }
    }

    // ---------------------------
    // AFFICHAGE DU MODAL
    // ---------------------------
    showModal(modal, textElement, modalBtn, message) {
        modal.style.opacity = "1";
        modal.style.visibility = "visible";

        if (textElement) {
            textElement.textContent = message;
            textElement.classList.add("modal-animate");
        }

        // ✅ Le bouton devient "Rejouer" et recharge la page
        modalBtn.textContent = "🔄 Rejouer";
        modalBtn.onclick = () => location.reload();
    }

    // ---------------------------
    // CHANGEMENT D'IMAGE
    // ---------------------------
    imageChange() {
        const { finalImg, inputFile, draggableDivs } = this.positionElements.elements;

        inputFile.addEventListener("change", () => {
            const url = URL.createObjectURL(inputFile.files[0]);

            finalImg.style.backgroundImage = `url(${url})`;
            draggableDivs.forEach(div => {
                div.style.backgroundImage = `url(${url})`;
            });

            this.points = { correct: 0, wrong: 0 };
        });
    }
}

export default DragDrop;
