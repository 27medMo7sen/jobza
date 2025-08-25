import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { WorkerService } from '../worker/worker.service';
import { EmployerService } from '../employer/employer.service';
import { AgencyService } from '../agency/agency.service';
import { FilesService } from '../files/files.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockAuthModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    save: jest.fn(),
    new: jest.fn().mockReturnValue({
      save: jest.fn(),
    }),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockMailService = {
    sendWelcomeEmail: jest.fn(),
  };

  const mockWorkerService = {
    createWorkerWithUserId: jest.fn(),
    updateWorker: jest.fn(),
    deleteWorker: jest.fn(),
    getWorkerByUserId: jest.fn(),
  };

  const mockEmployerService = {
    createEmployerWithUserId: jest.fn(),
    updateEmployer: jest.fn(),
    deleteEmployer: jest.fn(),
    getEmployerByUserId: jest.fn(),
  };

  const mockAgencyService = {
    createAgencyWithUserId: jest.fn(),
    updateAgency: jest.fn(),
    deleteAgency: jest.fn(),
    getAgencyByUserId: jest.fn(),
  };

  const mockFilesService = {
    deleteMultipleFiles: jest.fn(),
    listUserFiles: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('Auth'),
          useValue: mockAuthModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: WorkerService,
          useValue: mockWorkerService,
        },
        {
          provide: EmployerService,
          useValue: mockEmployerService,
        },
        {
          provide: AgencyService,
          useValue: mockAgencyService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should return a user when found', async () => {
      const mockUser = { email: 'test@example.com', role: 'worker' };
      mockAuthModel.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockAuthModel.findOne).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null when user not found', async () => {
      mockAuthModel.findOne.mockResolvedValue(null);

      const result = await service.getUserByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const mockUser = { _id: '123', email: 'test@example.com', role: 'worker' };
      mockAuthModel.findById.mockResolvedValue(mockUser);

      const result = await service.getUserById('123');
      expect(result).toEqual(mockUser);
      expect(mockAuthModel.findById).toHaveBeenCalledWith('123');
    });

    it('should return null when user not found', async () => {
      mockAuthModel.findById.mockResolvedValue(null);

      const result = await service.getUserById('nonexistent');
      expect(result).toBeNull();
    });
  });
});

