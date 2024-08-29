import { Request, Response } from 'express';
import { Message, User } from '../models';
import { isValidPassword } from '../services/bcrypt';
import { createUserId } from '../services/uuid';
import { Op, fn, col } from 'sequelize';

export const createUser = async (req: Request, res: Response) => {
  try {
    const data: any = req.body;
    const getExistingUser = await User.findOne({
      where: { email: data.email },
    });

    if (getExistingUser) {
      return res.status(409).json({ message: 'This email already exists' });
    }
    data.userId = await createUserId();

    const newUser = await User.create(data);
    return res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error(`Error createUser: ${error}`);
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    // Check if the user exists
    const user: any = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await isValidPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Create Session
    req.session.userId = user.userId;
    req.session.email = user.email;

    req.session.save((err) => {
      if (err) {
        console.error(`Error saving session: ${err}`);
        return res.status(500).json({ message: 'Server Error' });
      }
      console.info(`User ${req.session.id} logged in successfully.`);
      return res.status(200).json({ message: 'User logged in successfully' });
    });
  } catch (error) {
    console.error(`Error loginUser: ${error}`);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getSessionUser = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ message: 'Unauthorized request, please login first' });
    }

    const user: any = await User.findOne({
      where: {
        userId: userId,
      },
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(`Error getSessionUser: ${error}`);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Get the user ID from the session
    const userId = req.session.userId;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Check if the user exists
    const user: any = await User.findOne({ where: { userId: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear the session
    req.session.destroy((err) => {
      if (err) {
        console.error(`Error logging out user: ${err}`);
        return res.status(500).json({ message: 'Server Error' });
      }
      res.status(200).json({ message: 'User logged out successfully' });
    });
  } catch (error) {
    console.error(`Error logging out user: ${error}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const allUsers = await User.findAll({
      where: {
        userId: {
          [Op.ne]: userId,
        },
      },
      attributes: ['userId', 'name', 'email', 'createdAt'],
    });
    if (allUsers.length === 0) {
      return res.status(404).json({ message: 'No user found' });
    }

    return res.status(200).json(allUsers);
  } catch (error) {
    console.error(`Error getAllUsers: ${error}`);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({
      where: {
        userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    return res.status(201).json(user);
  } catch (error) {
    console.error(`Error getUserById =: ${error}`);
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const getUnreadMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const unreadCounts = await Message.findAll({
      attributes: ['senderId', [fn('COUNT', col('id')), 'unreadCount']],
      where: {
        recipientId: userId,
        read: false,
      },
      group: ['senderId'],
    });

    return res.status(200).json(unreadCounts);
  } catch (error) {
    console.error('Error fetching unread message counts:', error);
    res.status(500).json({ error: 'Failed to fetch unread message counts' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    await Message.update({ read: true }, { where: { senderId, recipientId } });

    return res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
