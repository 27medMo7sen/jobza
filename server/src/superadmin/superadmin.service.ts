import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin, AdminSchema } from '../admin/admin.model';
import { Auth, AuthSchema } from '../auth/auth.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperadminService {
  constructor(
    @InjectModel('Admin') private adminModel: Model<Admin>,
    @InjectModel('Auth') private authModel: Model<Auth>,
  ) {}

  async createAdmin(adminData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    // Check if admin with this email already exists
    const existingAdmin = await this.authModel.findOne({
      email: adminData.email,
    });
    if (existingAdmin) {
      throw new HttpException(
        'Admin with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create new admin in Auth collection
    const newAdmin = new this.authModel({
      name: adminData.name,
      email: adminData.email,
      userName: adminData.email.split('@')[0], // Extract username from email
      password: hashedPassword,
      role: adminData.role,
      method: 'local',
      isVerified: true, // Superadmin creates verified admins
    });

    // Create admin profile first
    const adminProfile = new this.adminModel({
      userId: newAdmin._id,
      userName: adminData.email.split('@')[0],
      email: adminData.email,
      name: adminData.name,
      // Other fields will be filled when admin updates their profile
    });

    const savedAdminProfile = await adminProfile.save();

    console.log('adminDataaa  ', adminData);
    // Update the auth record with the admin profile reference
    newAdmin.admin = savedAdminProfile._id;
    await newAdmin.save();
    // Return admin without password
    if (!newAdmin) {
      throw new HttpException(
        'Failed to create admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const { password, ...adminWithoutPassword } = newAdmin.toObject();
    return {
      message: 'Admin created successfully',
      admin: adminWithoutPassword,
    };
  }

  async deleteAdmin(email: string) {
    const admin = await this.authModel.findOne({
      email,
      role: { $in: ['admin', 'superadmin'] }, // Only delete admin/superadmin roles
    });

    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }

    // Delete admin profile first
    await this.adminModel.findOneAndDelete({ userId: admin._id });

    // Then delete auth record
    await this.authModel.findByIdAndDelete(admin._id);

    return {
      message: 'Admin deleted successfully',
      deletedAdmin: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async getAllAdmins() {
    const admins = await this.authModel
      .find({ role: { $in: ['admin', 'superadmin'] } }, { password: 0 })
      .populate('admin', 'name email phoneNumber gender country nationality')
      .exec();
    return {
      message: 'Admins retrieved successfully',
      admins,
    };
  }
}
