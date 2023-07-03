import { v4 as uuidv4, validate } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';

import { users } from '../index';
import { sendResponse } from '../utils/sendResponse';

const getUsers = (req: IncomingMessage, res: ServerResponse): void => {
  const usersData = users.getAllUsers();
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(usersData));
};

const getUserById = (req: IncomingMessage, res: ServerResponse, id: string): void => {
  if (!validate(id)) {
    sendResponse(res, 400, 'Invalid userId');
  } else {
    const user = users.getUserById(id);

    if (!user) {
      sendResponse(res, 404, 'User not found');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    }
  }
};

const createUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const requestData = await JSON.parse(body);
      const { username, age, hobbies } = requestData;

      if (username && age && hobbies) {
        if (
          Array.isArray(hobbies) &&
          hobbies.every((item) => typeof item === 'string') &&
          typeof age === 'number' &&
          typeof username === 'string'
        ) {
          const newUser = {
            id: uuidv4(),
            username,
            age,
            hobbies,
          };
          const user = users.createUser(newUser);

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 201;
          res.end(JSON.stringify(user));
        } else {
          sendResponse(
            res,
            400,
            'Username must be a string / Age must be a number / Hobbies must be an array of strings'
          );
        }
      } else {
        sendResponse(res, 400, 'Body does not contain required fields');
      }
    } catch (error) {
      sendResponse(res, 400, 'Error parsing request body');
    }
  });
};

const updateUser = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      if (!validate(id)) {
        sendResponse(res, 400, 'Invalid userId');
      } else {
        const requestData = await JSON.parse(body);
        const { username, age, hobbies } = requestData;

        if (
          Array.isArray(hobbies) &&
          hobbies.every((item) => typeof item === 'string') &&
          typeof age === 'number' &&
          typeof username === 'string'
        ) {
          const user = users.updateUser(id, requestData);

          if (!user) {
            sendResponse(res, 404, 'User not found');
          } else {
            user.username = username || user.username;
            user.age = age || user.age;
            user.hobbies = hobbies || user.hobbies;

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(user));
          }
        } else {
          sendResponse(
            res,
            400,
            'Username must be a string / Age must be a number / Hobbies must be an array of strings'
          );
        }
      }
    } catch (error) {
      sendResponse(res, 400, 'Error parsing request body');
    }
  });
};

const deleteUser = (req: IncomingMessage, res: ServerResponse, id: string): void => {
  if (!validate(id)) {
    sendResponse(res, 400, 'Invalid userId');
  } else {
    const user = users.deleteUser(id);

    if (!user) {
      sendResponse(res, 404, 'User not found');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 204;
      res.end();
    }
  }
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
