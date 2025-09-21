import axios from 'axios';
import Student from '../../models/Student';
import Class from '../../models/Class';
import { getStudentsByClass } from '../StudentListingService';

jest.mock('axios');
jest.mock('../../models/Student');
jest.mock('../../models/Class');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getStudentsByClass', () => {
  const classCode = 'MATH101';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return combined internal and external students sorted by name', async () => {
    // Mock internal DB students
    (Student.findAll as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Alice', email: 'alice@test.com' },
      { id: '2', name: 'Charlie', email: 'charlie@test.com' },
    ]);

    // Mock external API response
    mockedAxios.get.mockResolvedValue({
      data: {
        students: [{ id: '3', name: 'Bob', email: 'bob@test.com' }],
      },
    });

    const result = await getStudentsByClass(classCode, 0, 10);

    expect(Student.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: Class,
          where: { code: classCode },
          through: { attributes: [] },
        },
      ],
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:5000/students',
      { params: { class: classCode, offset: 0, limit: 10 } }
    );

    expect(result.count).toBe(3);
    expect(result.students.map((s) => s.name)).toEqual([
      'Alice',
      'Bob',
      'Charlie',
    ]);
  });

  it('should paginate results correctly', async () => {
    (Student.findAll as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Alice', email: 'alice@test.com' },
      { id: '2', name: 'Charlie', email: 'charlie@test.com' },
    ]);

    mockedAxios.get.mockResolvedValue({
      data: {
        students: [{ id: '3', name: 'Bob', email: 'bob@test.com' }],
      },
    });

    const result = await getStudentsByClass(classCode, 1, 1);

    expect(result.count).toBe(3);
    expect(result.students).toHaveLength(1);
    expect(result.students[0].name).toBe('Bob');
  });

  it('should handle when external API returns no students', async () => {
    (Student.findAll as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Alice', email: 'alice@test.com' },
    ]);

    mockedAxios.get.mockResolvedValue({ data: { students: [] } });

    const result = await getStudentsByClass(classCode, 0, 10);

    expect(result.count).toBe(1);
    expect(result.students[0].name).toBe('Alice');
  });

  it('should throw error when something fails', async () => {
    (Student.findAll as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(getStudentsByClass(classCode, 0, 10)).rejects.toThrow('Failed to fetch students');
  });
});
