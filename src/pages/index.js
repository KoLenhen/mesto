import './index.css';

import Card from '../scripts/components/Card.js';
import Section from '../scripts/components/Section.js';
import PopupWithForm from '../scripts/components/PopupWithForm.js';
import PopupWithImage from '../scripts/components/PopupWithImage.js';
import PopupWithVerification from '../scripts/components/PopupWithVerification.js';
import FormValidator from '../scripts/components/FormValidator.js';
import UserInfo from '../scripts/components/UserInfo.js';
import Api from '../scripts/components/Api.js';

import {
  profileName,
  profileRole,
  profileAvatar,
  addCard,
  editProfileInfo,
  editProfileAvatar,
  popupName,
  popupRole,
} from '../scripts/units/constants.js';

import { popupSelectors } from '../scripts/units/formData.js';
let userID = '';

// cards rendering
const cardsList = new Section({
  renderer: (item) => {
    const card = newCardGen(item);
    const cardItem = card.generateCard();
    cardsList.addItem(cardItem);
  }
}, '.locations');

const popupWithImage = new PopupWithImage('.popup_type_show');

const api = new Api({
  url: 'https://mesto.nomoreparties.co/v1/cohort-16/',
  headers: {
    authorization: 'cbe4503b-5ebe-4451-a159-203687412eb7',
    'Content-Type': 'application/json',
  }
});

api.getInitialData()
  .then((data) => {
    const [profileData, cardsData] = data;
    profileName.textContent = profileData.name;
    profileRole.textContent = profileData.about;
    profileAvatar.src = profileData.avatar;
    userID = profileData._id;
    cardsList.rendererItems(cardsData);
  })
  .catch((error) => { alert(error) });

function newCardGen(item) {
  const card = new Card({
    handleCardClick: (item) => {
      popupWithImage.open(item);
      popupWithImage.setEventListeners();
    },
    handleLikeClick: (item) => {
      api.addLikes(item)
        .then((item) => {
          card.setLikeCount(item);
        })
        .catch((err) => {
          console.log(err);
        })
    },
    handleDelLikeClick: (item) => {
      api.delLike(item)
        .then((item) => {
          card.setLikeCount(item);
        })
        .catch((err) => {
          console.log(err);
        })
    },
    handleTrashClick: () => {
      const delImage = new PopupWithVerification({
        handleSubmitButton: (item) => {
          delImage.preloader(true, 'Удаление...');
          api.delCard(item)
            .then(() => {
              cardsList.delItem(`_${item._id}`);
            })
            .catch((error) => {
              alert(error);
            })
            .finally(() => {
              delImage.preloader(false);
              card.deleteCard();
              delImage.close();
            })
        }
      }, '.popup_type_delete');
      delImage.open(item);
    }
  }, item, userID, '#location-card-template');
  return card;
}

// add new card
const addPopup = new PopupWithForm({
  handleSubmitButton: (list) => {
    addPopup.preloader(true);
    const obj = {
      name: list.locationName,
      link: list.locationRef,
      likes: [],
    }
    api.addCard(obj)
      .then((res) => {
        const card = newCardGen(res);
        const cardItem = card.generateCard();
        cardsList.addNew(cardItem);
      })
      .catch((error) => {
        alert(error + '139');
      })
      .finally(() => {
        addPopup.preloader(false);
        addPopup.close();
      })
  }
}, '.popup_type_add');

addCard.addEventListener('click', () => {
  addPopup.open();
});

addPopup.setEventListeners();

//edit profile
const formUserInfo =
  new UserInfo({
    name: profileName,
    role: profileRole,
  });

//edit profile avatar
const avatarEditPopup = new PopupWithForm({
  handleSubmitButton: (list) => {
    avatarEditPopup.preloader(true);
    api.setProfileAvatar(list)
      .then(() => {
        profileAvatar.src = list.avatar;
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        avatarEditPopup.preloader(false);
        avatarEditPopup.close();
      });
  }
}, '.popup_type_renew');

avatarEditPopup.setEventListeners();

editProfileAvatar.addEventListener('click', () => {
  avatarEditPopup.open();
});

// edit profile text
editProfileInfo.addEventListener('click', () => {
  const obj = formUserInfo.getUserInfo();
  popupName.value = obj.name;
  popupRole.value = obj.about;
  editPopup.open();
});

const editPopup = new PopupWithForm({
  handleSubmitButton: (list) => {
    editPopup.preloader(true);
    api.setProfile(list)
      .then(() => {
        formUserInfo.setUserInfo(list);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        editPopup.preloader(true);
        editPopup.close();
      })
  }
}, '.popup_type_edit');

editPopup.setEventListeners();

//forms validation
const editValidation = new FormValidator(popupSelectors, '.popup__container_type_edit');
editValidation.enableValidation();

const addValidation = new FormValidator(popupSelectors, '.popup__container_type_add');
addValidation.enableValidation();

const avatarValidation = new FormValidator(popupSelectors, '.popup__container_type_renew');
avatarValidation.enableValidation();

