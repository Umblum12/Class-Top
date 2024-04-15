// Clase para reservaciones
class Reservation {
    constructor(id, listingId, userId, date, details) {
      this.id = id;
      this.listingId = listingId; // ID de la estancia reservada
      this.userId = userId; // ID del usuario que hizo la reserva
      this.date = date; // Fecha de la reserva
      this.details = details;
      // Otros detalles de la reserva
    }
  }

  export default Reservation