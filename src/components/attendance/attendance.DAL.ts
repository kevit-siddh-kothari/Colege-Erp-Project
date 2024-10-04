import { Attendance, IAttendance } from './attendance.module';
import { logger } from '../../utils/winstone.logger'; // Assuming you are using a logger

class AttendanceDAL {
  /**
   * Fetch all attendance records with student details populated.
   * @returns An array of attendance records.
   * @throws Error if the query fails.
   */
  public async getAllAttendance(): Promise<IAttendance[]> {
    try {
      return await Attendance.find({}).populate('student').lean();
    } catch (error: any) {
      logger.error(`Error fetching all attendance: ${error.message}`);
      throw new Error(`Unable to fetch attendance records: ${error.message}`);
    }
  }

  /**
   * Create a new attendance record.
   * @param attendanceData - The attendance data to create.
   * @returns The created attendance record.
   * @throws Error if the creation fails.
   */
  public async createAttendance(attendanceData: Partial<IAttendance>): Promise<IAttendance> {
    try {
      const attendance = new Attendance(attendanceData);
      return await attendance.save();
    } catch (error: any) {
      logger.error(`Error creating attendance: ${error.message}`);
      throw new Error(`Unable to create attendance: ${error.message}`);
    }
  }

  /**
   * Find attendance by student ID and date.
   * @param studentId - The ID of the student.
   * @param date - The date of the attendance record.
   * @returns The attendance record or null.
   * @throws Error if the query fails.
   */
  public async findAttendanceByStudentAndDate(attendanceId: string): Promise<IAttendance | null> {
    try {
      return await Attendance.findById(attendanceId);
    } catch (error: any) {
      logger.error(`Error finding attendance for student ${attendanceId}: ${error.message}`);
      throw new Error(`Unable to find attendance: ${error.message}`);
    }
  }

  /**
   * Update an existing attendance record.
   * @param attendance - The attendance document to update.
   * @param updateData - The data to update the attendance record with.
   * @returns The updated attendance record.
   * @throws Error if the update fails.
   */
  public async updateAttendance(attendance: IAttendance, updateData: Partial<IAttendance>): Promise<IAttendance | null> {
    try {
      return await Attendance.findByIdAndUpdate(attendance._id, updateData, { new: true }).exec();
    } catch (error: any) {
      logger.error(`Error updating attendance for ID ${attendance._id}: ${error.message}`);
      throw new Error(`Unable to update attendance: ${error.message}`);
    }
  }
}

// Export an instance of the DAL
export const attendanceDAL = new AttendanceDAL();
