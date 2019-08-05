/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const UserSchema = Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'cannot be empty'],
    lowercase: true,
    index: true,
    autoIndex: false,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'cannot be empty'],
    lowercase: true,
    index: true,
    autoIndex: false,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  bio: String,
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  favourites: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  myArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
});

const autoPopulateArticles = function (next) {
  this.populate({
    path: 'myArticles',
    select: '-author',
  });
  next();
};

UserSchema.pre('find', autoPopulateArticles);
UserSchema.pre('findOne', autoPopulateArticles);

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
};

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = model('User', UserSchema);

export default User;
