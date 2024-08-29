import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../services/db/db';
import { MessageAttributes } from '../types/message';

interface MessageModel extends Model<MessageAttributes> {
  new (): MessageAttributes;
}

const Message = sequelize.define<MessageModel>(
  'messages',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  },
);

export default Message;
