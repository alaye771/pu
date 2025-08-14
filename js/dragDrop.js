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

        draggableDivs.forEach((draggableDiv, i) => {
            draggableDiv.addEventListener('dragstart', (e) => this.onDragStart(e));
            puzzleDivs[i].addEventListener('dragover', (e) => this.onDragOver(e));
            puzzleDivs[i].addEventListener('drop', () => this.onDrop(i));
            puzzleDivs[i].addEventListener('dragenter', () => puzzleDivs[i].classList.add("active"));
            puzzleDivs[i].addEventListener('dragleave', () => puzzleDivs[i].classList.remove("active"));
        });
    }

    onDragStart(e) {
        this.selected = e.target;
    }

    onDragOver(e) {
        e.preventDefault(); // Autorise le drop
    }

    onDrop(index) {
        const { puzzleDivs } = this.positionElements.elements;

        // Si la case est vide
        if (puzzleDivs[index].children.length === 0) {
            this.selected.style.top = '0';
            this.selected.style.left = '0';
            this.selected.style.border = 'none';
            puzzleDivs[index].append(this.selected);

            // Vérifie victoire/défaite
            this.checkGameState();
        }
    }

    // ---------------------------
    // VÉRIFICATION ÉTAT DU JEU
    // ---------------------------
    checkGameState() {
        const { puzzleDivs, modal, modalText, modalBtn, attempt, cellsAmount } = this.positionElements.elements;

        // Reset points
        this.points.correct = 0;
        this.points.wrong = 0;

        // Compte corrects et faux
        puzzleDivs.forEach((div) => {
            const child = div.firstElementChild;
            if (child && div.dataset.index === child.dataset.index) {
                this.points.correct++;
            } else {
                this.points.wrong++;
            }
        });

        // Victoire
        if (this.points.correct === cellsAmount) {
            this.showModal(modal, attempt, modalBtn, `You Won! Wrong Attempts: ${this.points.wrong}`);
            return;
        }

        // Défaite
        const foundEmpty = puzzleDivs.find((div) => !div.firstElementChild);
        if (!foundEmpty && this.points.correct < cellsAmount) {
            this.showModal(modal, modalText, modalBtn, "You Lost. Please Try Again");
        }
    }

    // ---------------------------
    // AFFICHAGE DU MODAL
    // ---------------------------
    showModal(modal, textElement, modalBtn, message) {
        modal.style.opacity = "1";
        modal.style.visibility = "visible";

        if (textElement) textElement.textContent = message;
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
            draggableDivs.forEach((div) => {
                div.style.backgroundImage = `url(${url})`;
            });

            this.points = { correct: 0, wrong: 0 };
        });
    }
}

export default DragDrop;
