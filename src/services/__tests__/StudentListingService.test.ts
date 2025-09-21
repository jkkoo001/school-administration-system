import axios from 'axios';
import Student from '../../models/Student';
import Class from '../../models/Class';
import { getStudentsByClass } from '../StudentListingService';
import ErrorBase from '../../errors/ErrorBase';

jest.mock('axios');
jest.mock('../../models/Student');
jest.mock('../../models/Class');

describe('getStudentsByClass', () => {
  const mockClassCode = 'C101';
  const mockOffset = 0;
  const mockLimit = 2;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return combined and sorted students', async () => {
    // Mock internal students
    (Student.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ]);

    // Mock external students
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        students: [{ id: 3, name: 'Charlie', email: 'charlie@example.com' }],
      },
    });

    const result = await getStudentsByClass(
      mockClassCode,
      mockOffset,
      mockLimit
    );

    expect(Student.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: Class,
          where: { code: mockClassCode },
          through: { attributes: [] },
        },
      ],
    });

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/students', {
      params: { class: mockClassCode, offset: mockOffset, limit: mockLimit },
    });

    // Sorted order: Alice, Bob, Charlie
    expect(result).toEqual({
      count: 3,
      students: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ], // paginated to first 2
    });
  });

  it('should handle empty external students gracefully', async () => {
    (Student.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
    ]);

    (axios.get as jest.Mock).mockResolvedValue({ data: { students: [] } });

    const result = await getStudentsByClass(
      mockClassCode,
      mockOffset,
      mockLimit
    );

    expect(result).toEqual({
      count: 1,
      students: [{ id: 1, name: 'Alice', email: 'alice@example.com' }],
    });
  });

  it('should throw ErrorBase if Student.findAll fails', async () => {
    (Student.findAll as jest.Mock).mockRejectedValue(new Error('DB failure'));

    await expect(
      getStudentsByClass(mockClassCode, mockOffset, mockLimit)
    ).rejects.toThrow(ErrorBase);
  });

  it('should throw ErrorBase if axios.get fails', async () => {
    (Student.findAll as jest.Mock).mockResolvedValue([]);
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network down'));

    await expect(
      getStudentsByClass(mockClassCode, mockOffset, mockLimit)
    ).rejects.toThrow(ErrorBase);
  });
});
