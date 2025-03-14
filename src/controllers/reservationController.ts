import { Context } from 'hono';
import { ReservationRequest } from '../types';
import { logger } from '../utils/logger';

// In a real implementation, this would be a database model
// For this example, we keep the reservations in memory
const reservations: ReservationRequest[] = [];

export const reservationController = {
  /**
   * Create a new reservation
   */
  async createReservation(c: Context): Promise<Response> {
    try {
      const data = await c.req.json() as ReservationRequest;
      
      // Validate minimum required data
      if (!data.name || !data.date || !data.time || !data.people || !data.phone) {
        return c.json({ 
          success: false, 
          error: 'Faltan datos requeridos para la reserva' 
        }, 400);
      }
      
      // Validate the number of people (according to the established maximum).v
      const maxPeople = parseInt(process.env.MAX_RESERVATION_SIZE || '10');
      if (data.people > maxPeople) {
        return c.json({ 
          success: false, 
          error: `El máximo de personas por reserva es ${maxPeople}` 
        }, 400);
      }
      
      // In a real implementation, we would check availability
      // For this example, we simply add the reservation
      reservations.push(data);
      
      logger.info(`Nueva reserva creada: ${data.name} para ${data.people} personas el ${data.date} a las ${data.time}`);
      
      return c.json({ 
        success: true, 
        message: 'Reserva creada con éxito',
        reservation: data
      }, 201);
    } catch (error: any) {
      logger.error(`Error al crear reserva: ${error.message}`);
      return c.json({ 
        success: false, 
        error: 'Error al procesar la solicitud de reserva' 
      }, 500);
    }
  },
  
  /**
   * Gets all reservations
   * In a real implementation, this would have filters and paging.
   */
  async getReservations(c: Context): Promise<Response> {
    try {
      // In a real implementation, there would be authorization logic here.
      return c.json({ 
        success: true, 
        reservations 
      });
    } catch (error: any) {
      logger.error(`Error al obtener reservas: ${error.message}`);
      return c.json({ 
        success: false, 
        error: 'Error al obtener las reservas' 
      }, 500);
    }
  }
};