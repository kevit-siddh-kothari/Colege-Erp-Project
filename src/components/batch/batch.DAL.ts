import { Batch, IBatch } from './batch.module';
import { Department, IDepartment } from '../department/department.module';
import { logger } from '../../utils/winstone.logger'; // Assuming you're using a logger

class BatchDAL {
  /**
   * Get all batches.
   * @returns An array of batches.
   * @throws Error if the query fails.
   */
  public async getAllBatches(): Promise<IBatch[]> {
    try {
      return await Batch.find({}).lean();
    } catch (error: any) {
      logger.error(`Error fetching all batches: ${error.message}`);
      throw new Error(`Unable to fetch batches: ${error.message}`);
    }
  }

  /**
   * Find a department by its ID.
   * @param departmentId - The ID of the department.
   * @returns The department object or null.
   * @throws Error if the query fails.
   */
  public async findDepartmentById(departmentId: string): Promise<IDepartment | null> {
    try {
      return await Department.findById(departmentId);
    } catch (error: any) {
      logger.error(`Error finding department by ID: ${error.message}`);
      throw new Error(`Unable to find department: ${error.message}`);
    }
  }

  /**
   * Find a batch by year.
   * @param year - The year of the batch.
   * @returns The batch object or null.
   * @throws Error if the query fails.
   */
  public async findBatchByYear(year: string): Promise<IBatch | null> {
    try {
      return await Batch.findOne({ year });
    } catch (error: any) {
      logger.error(`Error finding batch by year: ${error.message}`);
      throw new Error(`Unable to find batch: ${error.message}`);
    }
  }

  /**
   * Update a batch's branch based on year and departmentId.
   * @param year - The year of the batch.
   * @param departmentId - The department's ID.
   * @param batchData - The data to update the batch with.
   * @returns The result of the update operation.
   * @throws Error if the update fails.
   */
  public async updateBatch(year: string, departmentId: string, batchData: Partial<IBatch>): Promise<any> {
    try {
      return await Batch.updateOne(
        { year, 'branches.departmentId': departmentId },
        { $set: { 'branches.$': batchData } }
      );
    } catch (error: any) {
      logger.error(`Error updating batch for year ${year} and departmentId ${departmentId}: ${error.message}`);
      throw new Error(`Unable to update batch: ${error.message}`);
    }
  }

  /**
   * Add a new branch to a batch.
   * @param year - The year of the batch.
   * @param branchData - The branch data to add to the batch.
   * @returns The result of the update operation.
   * @throws Error if the addition fails.
   */
  public async addBranchToBatch(year: string, branchData: Partial<IBatch>): Promise<any> {
    try {
      return await Batch.updateOne(
        { year, 'branches.departmentId': { $ne: branchData.departmentId } },
        { $push: { branches: branchData } }
      );
    } catch (error: any) {
      logger.error(`Error adding branch to batch for year ${year}: ${error.message}`);
      throw new Error(`Unable to add branch to batch: ${error.message}`);
    }
  }

  /**
   * Create a new batch.
   * @param batchData - An array of batch data.
   * @returns The created batch objects.
   * @throws Error if the batch creation fails.
   */
  public async createBatch(batchData: IBatch[]): Promise<IBatch[]> {
    try {
      return await Batch.create(batchData);
    } catch (error: any) {
      logger.error(`Error creating batch: ${error.message}`);
      throw new Error(`Unable to create batch: ${error.message}`);
    }
  }
}

export const batchDAL = new BatchDAL();
