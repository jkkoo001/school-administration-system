import { updateClassName } from '../UpdateClassService';
import Class from '../../models/Class';
import ErrorBase from '../../errors/ErrorBase';

jest.mock('../../models/Class');

describe('updateClassName', () => {
  const classCode = 'MATH101';
  const newName = 'Advanced Mathematics';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update class name if class exists', async () => {
    const mockSave = jest.fn().mockResolvedValue(undefined);
    (Class.findOne as jest.Mock).mockResolvedValue({
      code: classCode,
      save: mockSave,
    });

    await updateClassName(classCode, newName);

    expect(Class.findOne).toHaveBeenCalledWith({ where: { code: classCode } });
    expect(mockSave).toHaveBeenCalled();
  });

  it('should throw error if save fails', async () => {
    const mockSave = jest.fn().mockRejectedValue(new Error('DB error'));
    (Class.findOne as jest.Mock).mockResolvedValue({
      code: classCode,
      save: mockSave,
    });

    await expect(updateClassName(classCode, newName)).rejects.toBeInstanceOf(
      ErrorBase
    );
    await expect(updateClassName(classCode, newName)).rejects.toThrow('Failed to update class name');
  });

  it('should throw error if findOne fails', async () => {
    (Class.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(updateClassName(classCode, newName)).rejects.toBeInstanceOf(
      ErrorBase
    );
    await expect(updateClassName(classCode, newName)).rejects.toThrow('Failed to update class name');
  });
});
