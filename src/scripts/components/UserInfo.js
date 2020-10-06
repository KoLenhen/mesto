export default class UserInfo {
  constructor(obj) {
    this._name = obj.name;
    this._role = obj.role;
  }

  getUserInfo() {
    const obj = {
      name: this._name.textContent,
      role: this._role.textContent,
    };
    return obj;
  }

  setUserInfo(obj) {
    this._name.textContent = obj.userName;
    this._role.textContent = obj.userRole;
  }
}
