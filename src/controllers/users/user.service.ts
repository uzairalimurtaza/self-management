import { ObjectId } from 'mongoose';
import { IUserDocument } from '../../interfaces/IUser';
import { User } from '../../models/user';

export class userService {
  public async saveNewUserWallet(apiClientPayload: Partial<IUserDocument>): Promise<void> {
    const user = new User(apiClientPayload);
    await user.save();
  }
  public async findUserByWalletAddress(user_wallet_address: string): Promise<IUserDocument | null> {
    return User.findOne({ user_wallet_address });
  }
  public async findUserByUsername(username: string): Promise<IUserDocument | null> {
    return User.findOne({ username });
  }
  public async findUserByEmail(user_email: string): Promise<IUserDocument | null> {
    return User.findOne({ user_email });
  }
  public async dynamicUserSearch(property_name: string, value: string): Promise<IUserDocument | null> {
    return User.findOne({ [property_name]: value });
  }
  public async saveOTP(user_id: ObjectId, otp_code: string): Promise<IUserDocument | null> {
    const now = new Date();
    return User.findByIdAndUpdate(user_id, {
      otp_code: otp_code, otp_expires: now.setMinutes(now.getMinutes() + 2)
    });
  }
  public async verifyOTP(user_id: ObjectId, otp_code: string): Promise<IUserDocument | null> {
    return User.findOneAndUpdate(
      { _id: user_id, otp_code, otp_expires: { $gt: new Date() } },
      { otp_code: undefined, otp_expires: undefined }
    );
  }
  public async saveUserPassword(user_id: ObjectId, password: string): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(
      { _id: user_id },
      { password }
    );
  }
  public async saveUserRecord(userRecord: Partial<IUserDocument>): Promise<IUserDocument | null> {
    return User.create(userRecord);
  }
}
