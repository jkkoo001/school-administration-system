import Logger from '../config/logger';
import ErrorBase from '../errors/ErrorBase';
import ErrorCodes from '../const/ErrorCodes';
import Class from '../models/Class';

const LOG = new Logger(__filename);

export const updateClassName = async (classCode: string, className: string): Promise<void> => {
  try {
    const classData = await Class.findOne({ where: { code: classCode } });

    if (!classData) {
      LOG.error(`Class ${classCode} not found`);

      throw new ErrorBase(
        `Class not found: ${classCode}`,
        ErrorCodes.RUNTIME_ERROR_CODE,
        400
      );
    }

    classData.name = className;
    await classData.save();
    LOG.info(`Updated class ${classCode} to ${className}`);
  } catch (error) {
    LOG.error(`Failed to update class name for ${classCode}: ${error}`);
    throw new ErrorBase(
      'Failed to update class name',
      ErrorCodes.RUNTIME_ERROR_CODE,
      500
    );
  }
}
