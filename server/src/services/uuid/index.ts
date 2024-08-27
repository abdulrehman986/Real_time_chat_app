import { v4 as uuidv4 } from 'uuid';
import { User } from '../../models';

export async function createUserId() {
  try {
    let userId, findUser;

    do {
      userId = uuidv4();
      findUser = await User.findOne({ where: { userId: userId } });
    } while (findUser);

    return userId;
  } catch (error) {
    console.error(`Error createUserId: ${error}`);
  }
}
