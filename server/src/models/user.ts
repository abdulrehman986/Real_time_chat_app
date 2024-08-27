import { UserAttributes } from '../types/user';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../services/db/db';
import config from '../config';
import bcrypt from 'bcrypt';

interface UserModel extends Model<UserAttributes> {
  new (): UserAttributes;
}

const User = sequelize.define<UserModel, UserAttributes>(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export default User;
User.beforeCreate(async (user: UserModel) => {
  const salt = await bcrypt.genSalt(config.SALT_ROUNDS);

  if (user instanceof User) {
    user.setDataValue(
      'password',
      await bcrypt.hash(user.getDataValue('password'), salt),
    );
  }
});
