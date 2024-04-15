class User {
    constructor(id, name, role,email, password) {
      this.id = id;
      this.name = name;
      this.role = role; // 'host' o 'guest'
      this.email = email;
      this.password = password;
      // Otros detalles del usuario
    }
  }

  export default User