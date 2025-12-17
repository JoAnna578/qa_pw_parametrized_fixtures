import { test } from '../_fixtures/fixtures';
import {
  EMPTY_USERNAME_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  EMPTY_PASSWORD_MESSAGE,
} from '../../src/ui/constants/authErrorMessages';
const testParameters = [
  {
    title: 'empty username',
    username: '',
    email: 'test@test.com',
    password: 'Test1234!',
    message: EMPTY_USERNAME_MESSAGE,
  },
  {
    title: 'empty email',
    username: 'testuser',
    email: '',
    password: 'Test1234!',
    message: INVALID_EMAIL_MESSAGE,
  },
  {
    title: 'empty password',
    username: 'testuser',
    email: 'test@test.com',
    password: '',
    message: EMPTY_PASSWORD_MESSAGE,
  },
];

testParameters.forEach(({ title, username, email, password, message }) => {
  test.describe('Sign up negative tests', () => {
    test(`Sign up with ${title}`, async ({ signUpPage }) => {
      await signUpPage.open();

      if (username !== '') {
        await signUpPage.fillUsernameField(username);
      }
      if (email !== '') {
        await signUpPage.fillEmailField(email);
      }
      if (password !== '') {
        await signUpPage.fillPasswordField(password);
      }

      await signUpPage.clickSignUpButton();
      await signUpPage.assertErrorMessageContainsText(message);
    });
  });
});
