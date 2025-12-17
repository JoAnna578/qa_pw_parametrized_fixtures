import { test } from '../_fixtures/fixtures';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import { generateNewArticleData } from '../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';

const testParameters = [
  { articlesPerUser: 1 },
  { articlesPerUser: 2 },
  { articlesPerUser: 3 },
];

test.describe('Your feeds - three users', () => {
  let users = [];

  // Tworzymy trzech nowych użytkowników
  test.beforeAll(() => {
    for (let i = 0; i < 3; i++) {
      users.push(generateNewUserData());
    }
  });

  testParameters.forEach(({ articlesPerUser }) => {
    test(`Verify Your Feed shows articles when each user creates ${articlesPerUser} articles`, async ({
      page,
      homePage,
      browserContext,
    }) => {
      const userPages = [];

      // Każdy użytkownik tworzy artykuły w oddzielnym kontekście
      for (let user of users) {
        const userPage = await browserContext.newPage();
        userPages.push(userPage);
        await signUpUser(userPage, user);

        for (let i = 0; i < articlesPerUser; i++) {
          const article = generateNewArticleData(null, 2); // np. 2 tagi
          await userPage.goto('/editor');
          await userPage.fill('[placeholder="Article Title"]', article.title);
          await userPage.fill(
            '[placeholder="What\'s this article about?"]',
            article.description,
          );
          await userPage.fill(
            '[placeholder="Write your article (in markdown)"]',
            article.text,
          );
          await userPage.fill(
            '[placeholder="Enter tags"]',
            article.tags.join(' '),
          );
          await userPage.click('text=Publish Article');
        }

        await userPage.close(); // zamykamy kontekst po stworzeniu artykułów
      }

      // Logujemy pierwszego użytkownika w osobnym kontekście
      const feedPage = await browserContext.newPage();
      await signUpUser(feedPage, users[0]);

      // First user follows the other two
      for (let i = 1; i < users.length; i++) {
        await homePage.goToUserProfile(users[i].username);
        await homePage.clickFollowButton();
      }

      await homePage.clickYourFeedTab();

      // Sprawdzamy, że artykuły od pozostałych 2 użytkowników są widoczne
      for (let i = 1; i < users.length; i++) {
        for (let j = 0; j < articlesPerUser; j++) {
          // Można sprawdzić tytuł artykułu lub autora
          // Jeśli tytuły są losowe, najlepiej sprawdzić autora
          await homePage.assertArticleAuthorIsVisible(users[i].username);
        }
      }

      await feedPage.close();
    });
  });
});
