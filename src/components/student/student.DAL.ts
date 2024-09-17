import { Student, IStudent } from './student.module';
import { Department } from '../department/department.module';
import { Attendance } from '../attendance/attendance.module';
import { Batch, IBatch } from '../batch/batch.module';
import { logger } from '../../utils/winstone.logger';

class StudentDal {
  /**
   * Find a student by ID.
   * @param id - The student ID.
   * @returns The student object or null.
   * @throws Error if the query fails.
   */
  public async StudentFindOne(id: any): Promise<IStudent | null> {
    try {
      return await Student.findOne({ _id: id });
    } catch (error: any) {
      logger.error(`Error finding student by ID: ${error.message}`);
      throw new Error(`Unable to find student: ${error.message}`);
    }
  }

  /**
   * Get the total number of students.
   * @returns The total count of students.
   * @throws Error if the query fails.
   */
  public async StudentCount(): Promise<number> {
    try {
      return await Student.countDocuments();
    } catch (error: any) {
      logger.error(`Error counting students: ${error.message}`);
      throw new Error(`Unable to count students: ${error.message}`);
    }
  }

  /**
   * Find a department by name.
   * @param branch - The department name.
   * @returns The department object or null.
   * @throws Error if the query fails.
   */
  public async DepartmentFind(branch: string): Promise<any> {
    try {
      return await Department.findOne({ departmentname: branch }, { _id: 1 });
    } catch (error: any) {
      logger.error(`Error finding department: ${error.message}`);
      throw new Error(`Unable to find department: ${error.message}`);
    }
  }

  /**
   * Get analytics data for students, grouped by department and batch.
   * @returns Aggregated data of students by year and department.
   * @throws Error if the aggregation fails.
   */
  public async getAnalyticsData(): Promise<any> {
    try {
      return await Student.aggregate([
        {
          $lookup: {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'departmentInfo',
          },
        },
        {
          $unwind: '$departmentInfo',
        },
        {
          $group: {
            _id: {
              year: '$batch',
              branch: '$departmentInfo.departmentname',
            },
            totalStudents: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.year',
            totalStudents: { $sum: '$totalStudents' },
            branches: {
              $push: {
                k: '$_id.branch',
                v: '$totalStudents',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            year: '$_id',
            totalStudents: 1,
            branches: {
              $arrayToObject: {
                $map: {
                  input: '$branches',
                  as: 'branch',
                  in: {
                    k: '$$branch.k',
                    v: '$$branch.v',
                  },
                },
              },
            },
          },
        },
        {
          $sort: { year: 1 },
        },
      ]);
    } catch (error: any) {
      logger.error(`Error getting analytics data: ${error.message}`);
      throw new Error(`Unable to get analytics data: ${error.message}`);
    }
  }

  /**
   * Find department by its ID.
   * @param branchId - The department ID.
   * @returns The department object or null.
   * @throws Error if the query fails.
   */
  public async FindDepartmentById(branchId: string): Promise<any> {
    try {
      return await Department.findOne({ _id: branchId }, { _id: 1 }).lean();
    } catch (error: any) {
      logger.error(`Error finding department by ID: ${error.message}`);
      throw new Error(`Unable to find department: ${error.message}`);
    }
  }

  /**
   * Get the total number of students marked as present.
   * @returns Aggregated attendance data for all students.
   * @throws Error if the aggregation fails.
   */
  public async GetTotalStudentsPresent(): Promise<any> {
    try {
      return await Attendance.aggregate([
        {
          $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'studentInfo',
          },
        },
        {
          $unwind: '$studentInfo',
        },
        {
          $group: {
            _id: '$studentInfo',
            TotalPresent: {
              $sum: { $cond: [{ $eq: ['$isPresent', true] }, 1, 0] },
            },
          },
        },
      ]);
    } catch (error: any) {
      logger.error(`Error getting total students present: ${error.message}`);
      throw new Error(`Unable to get total students present: ${error.message}`);
    }
  }

  /**
   * Get the total number of students grouped by batch and department.
   * @returns Aggregated student data grouped by batch and department.
   * @throws Error if the aggregation fails.
   */
  public async getTotalStudentByBatchAndDepartment(): Promise<any> {
    try {
      return await Student.aggregate([
        {
          $group: {
            _id: { batch: '$batch', department: '$department' },
            count: { $sum: 1 },
          },
        },
      ]);
    } catch (error: any) {
      logger.error(`Error getting total students by batch and department: ${error.message}`);
      throw new Error(`Unable to get total students by batch and department: ${error.message}`);
    }
  }

  /**
   * Update the batch after a student is deleted and update the seat counts.
   * @param exists - The existing student and batch information.
   * @throws Error if the update or deletion fails.
   */
  public async BatchUpdateForDelete(exists: any): Promise<void> {
    try {
      await Batch.updateOne(
        { '_id': exists.batch, 'branches.departmentId': exists.department },
        { $inc: { 'branches.$.availableSeats': 1, 'branches.$.occupiedSeats': -1 } }
      );
      await Student.deleteOne({ _id: exists._id });
      await Attendance.deleteMany({ student: exists._id });
    } catch (error: any) {
      logger.error(`Error updating batch for delete: ${error.message}`);
      throw new Error(`Unable to update batch or delete student: ${error.message}`);
    }
  }

  /**
   * Delete all students from the database.
   * @returns A result object from the deletion.
   * @throws Error if the deletion fails.
   */
  public async DeleteAllStudent(): Promise<any> {
    try {
      return await Student.deleteMany({});
    } catch (error: any) {
      logger.error(`Error deleting all students: ${error.message}`);
      throw new Error(`Unable to delete all students: ${error.message}`);
    }
  }

  /**
   * Delete all attendance records.
   * @returns A result object from the deletion.
   * @throws Error if the deletion fails.
   */
  public async DeleteAllAttendance(): Promise<any> {
    try {
      return await Attendance.deleteMany({});
    } catch (error: any) {
      logger.error(`Error deleting all attendance records: ${error.message}`);
      throw new Error(`Unable to delete all attendance records: ${error.message}`);
    }
  }

  /**
   * Update the batch after a student is added and update seat counts.
   * @param batchId - The ID of the batch.
   * @param departmentId - The ID of the department.
   * @returns The result of the batch update.
   * @throws Error if the update fails.
   */
  public async UpdateBatchOnStudentAdd(batchId: string, departmentId: string): Promise<any> {
    try {
      return await Batch.updateOne(
        { '_id': batchId, 'branches.departmentId': departmentId },
        { $inc: { 'branches.$.availableSeats': -1, 'branches.$.occupiedSeats': 1 } }
      );
    } catch (error: any) {
      logger.error(`Error updating batch on student add: ${error.message}`);
      throw new Error(`Unable to update batch on student add: ${error.message}`);
    }
  }

  /**
   * Save a student to the database.
   * @param student - The student object to save.
   * @returns The saved student object.
   * @throws Error if the save fails.
   */
  public async saveStudent(student: IStudent): Promise<IStudent> {
    try {
      return await student.save();
    } catch (error: any) {
      logger.error(`Error saving student: ${error.message}`);
      throw new Error(`Unable to save student: ${error.message}`);
    }
  }
}

export const studentDal = new StudentDal();
