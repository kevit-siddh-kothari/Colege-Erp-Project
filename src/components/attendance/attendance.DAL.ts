import { Attendance, IAttendance } from './attendance.module';

class AttendanceDAL {
  public async getAllAttendance(): Promise<IAttendance[]> {
    return Attendance.find({}).populate('student').lean();
  }

  public async createAttendance(attendanceData: Partial<IAttendance>): Promise<IAttendance> {
    const attendance = new Attendance(attendanceData);
    return attendance.save();
  }

  public async findAttendanceByStudentAndDate(studentId: string, date: string): Promise<IAttendance | null> {
    return await Attendance.findOne({ student: studentId, createdAt: date });
  }

  public async updateAttendance(attendance: IAttendance, updateData: Partial<IAttendance>){
    return await Attendance.findByIdAndUpdate(attendance._id, updateData).exec();
  }
}

// Export an instance of the DAL
export const attendanceDAL = new AttendanceDAL();
