class Listing {
    constructor(id, title, location, description, imageSrc, category, guestCount, price, userId) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.imageSrc = imageSrc;
      this.category = category;
      this.guestCount = guestCount;
      this.location = location;
      this.price = price;
      this.userId = userId;

      // Otros detalles de la estancia
    }
  }

  export default Listing