import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateUserDto } from './dto/user-update.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {

  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) { }

  async byId(_id: string) {
    const user = await this.UserModel.findById(_id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }
  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.UserModel.findById(_id)
    const isSameUser = await this.UserModel.findOne({ email: dto.email })
    if (isSameUser && String(_id) !== String(isSameUser._id)) {
      throw new NotFoundException('Email is already busy')
    }
    if (dto.password) {
      const salt = await genSalt(10)
      user.password = await hash(dto.password, salt)
    }
    if (dto.username) {
      user.username = dto.username
    }
    if (dto.sex) {
      user.sex = dto.sex
    }
    if (dto.avatar) {
      user.avatar = dto.avatar
    }
    if (dto.phone_number) {
      user.phone_number = dto.phone_number
    }
    user.email = dto.email
    if (dto.isAdmin || dto.isAdmin === true) {
      user.isAdmin = dto.isAdmin
    }
    await user.save()

    return
  }
  async getCount() {
    return this.UserModel.find().count().exec()
  }
  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) options = { $or: [{ email: new RegExp(searchTerm, 'i') }] }
    return this.UserModel.find(options).select('-password -updatedAt -__v').sort({ createdAt: 'desc' }).exec()
  }



  async delete(id: string) {
    return this.UserModel.findByIdAndDelete(id).exec()
  }



  async toogleFavorite(productId: Types.ObjectId, user: UserModel) {

    const { _id, favorites } = user

    await this.UserModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(productId) ? favorites.filter(id => String(id) !== String(productId)) : [...favorites, productId]
    })
  }


  async getFavoriteProduct(_id: Types.ObjectId) {
    return await this.UserModel.findById(_id, 'favorites').populate({
      path: 'favorites', populate: {
        path: 'category'
      }
    }).exec().then(data => data.favorites)
  }
}
