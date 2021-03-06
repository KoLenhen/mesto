import Popup from './Popup.js';

export default class PopupWithForm extends Popup {
  constructor({ handleSubmitButton }, containerSelector) {
    super(containerSelector);
    this._handleSubmitButton = handleSubmitButton;
    this._setValues = this._setValues.bind(this);
    this._formElement = this._containerElement.querySelector('.popup__form');
    this._inputsList = this._formElement.querySelectorAll('.popup__text');
    this._submitBtn = this._containerElement.querySelector('.popup__btn');
    this._submitBtnText = this._submitBtn.textContent;
  }


  preloader( inProcess, text =  'Cохранение...') {
    if (inProcess) {
      this._submitBtn .textContent = text;
    } else {
      this._submitBtn.textContent = this._submitBtnText;
    }
  }

  _getInputValues() {
    const inputsValues = {};
    this._inputsList.forEach(input => inputsValues[input.name] = input.value);
    return inputsValues;
  }

  _setValues(event) {
    event.preventDefault();
    this._handleSubmitButton(this._getInputValues());
  }

  setEventListeners() {
    super.setEventListeners();
    this._formElement.addEventListener('submit', this._setValues);
  }

  close() {
    super.close();
    this._formElement.reset();
  }
}
