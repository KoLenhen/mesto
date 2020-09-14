export default class Card {
    
    constructor(cardData, cardSelector, popupImageOpen) {
        this._cardSelector = cardSelector;
        this._name = cardData.name;
        this._link = cardData.link;
        this._popupImageOpen = popupImageOpen;
    }

    _getTemplate() {
        const cardElement = document.querySelector(this._cardSelector)
            .content.querySelector('.location').cloneNode(true);
        return cardElement;
    }

    generateCard() {
        this._element = this._getTemplate();
        this._element.querySelector('.location__image').src = this._link;
        this._element.querySelector('.location__name').textContent = this._name;

        this._setEventListeners();

        return this._element;
    }

    _setEventListeners() {
        this._element.querySelector('.location__trash').addEventListener('click', () => {
            this._handleDeleteClick();
        });

        this._element.querySelector('.location__rate').addEventListener('click', () => {
            this._handleRateClick();
        });

        this._element.querySelector('.location__image').addEventListener('click', () => {
            this._handleImageClick();
        });
    }

    _handleDeleteClick() {
        this._element.querySelector('.location__trash').closest('.location').remove();
    }

    _handleRateClick() {
        this._element.querySelector('.location__rate').classList.toggle('location__rate_marked');
    }

    _handleImageClick() {
        this._popupImageOpen(document.querySelector('.popup_type_show'));
    }
}

