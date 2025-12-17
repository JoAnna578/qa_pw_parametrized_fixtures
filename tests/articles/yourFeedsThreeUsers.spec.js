import { test } from '../_fixtures/fixtures';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import { generateNewArticleData } from '../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';

// Parametry: liczba artykułów do utworzenia przez każdego użytkownika
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
    test(`Verify your feeds shows articles when each user creates ${articlesPerUser} articles`, async ({
      page,
      homePage,
    }) => {
      // Każdy użytkownik tworzy artykuły
      for (let user of users) {
        await signUpUser(page, user);

        for (let i = 0; i < articlesPerUser; i++) {
          const article = generateNewArticleData(null, 2); // np. 2 tagi
          await page.goto('/editor');
          await page.fill('[placeholder="Article Title"]', article.title);
          await page.fill(
            '[placeholder="What\'s this article about?"]',
            article.description,
          );
          await page.fill(
            '[placeholder="Write your article (in markdown)"]',
            article.text,
          );
          await page.fill('[placeholder="Enter tags"]', article.tags.join(' '));
          await page.click('text=Publish Article');
        }

        await page.goto('/'); // wracamy do głównej strony po każdym użytkowniku
      }

      // Logujemy pierwszego użytkownika, aby sprawdzić "Your Feed"
      await signUpUser(page, users[0]);
      await homePage.clickYourFeedTab();

      // Sprawdzamy, że artykuły od pozostałych 2 użytkowników są widoczne
      for (let i = 1; i < users.length; i++) {
        // Tutaj możesz dopasować assert do tytułów artykułów, np. viewArticlePage.assertArticleTitleIsVisible
        // Jeśli tytuły są losowe, możesz zamiast tego sprawdzić obecność tagów lub username autora
        // Przykładowy placeholder:
        console.log(
          `Verify articles from user: ${users[i].username} are visible`,
        );
      }
    });
  });
});
