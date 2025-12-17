import { test } from '../../_fixtures/fixtures';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

const testParameters = [
  { tagsNumber: 1, testNameEnding: 'one tag' },
  { tagsNumber: 2, testNameEnding: 'two tags' },
  { tagsNumber: 10, testNameEnding: 'ten tags' },
];

test.describe('Create an article with tags', () => {
  test.beforeEach(async ({ page, user }) => {
    await signUpUser(page, user);
  });

  testParameters.forEach(({ tagsNumber, testNameEnding }) => {
    test(`Create an article with ${testNameEnding}`, async ({
      homePage,
      createArticlePage,
      viewArticlePage,
      logger,
    }) => {
      const article = generateNewArticleData(logger, tagsNumber);

      await homePage.clickNewArticleLink();

      await createArticlePage.fillTitleField(article.title);
      await createArticlePage.fillDescriptionField(article.description);
      await createArticlePage.fillTextField(article.text);
      await createArticlePage.fillTagsField(article.tags);
      await createArticlePage.clickPublishArticleButton();

      await viewArticlePage.assertArticleTitleIsVisible(article.title);
      await viewArticlePage.assertArticleTextIsVisible(article.text);
      await viewArticlePage.assertArticleTagsAreVisible(article.tags);
    });
  });
});
