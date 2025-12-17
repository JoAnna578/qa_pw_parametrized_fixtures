import { test } from '../../_fixtures/fixtures';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

const testParameters = [
  { tagsNumber: 1, testNameEnding: 'one tag' },
  { tagsNumber: 2, testNameEnding: 'two tags' },
  { tagsNumber: 5, testNameEnding: 'five tags' },
];

test.describe('Create and edit article with tags', () => {
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

    test(`Add and remove tags for an article with ${testNameEnding}`, async ({
      homePage,
      createArticlePage,
      viewArticlePage,
      logger,
    }) => {
      // Tworzymy artykuł
      const article = generateNewArticleData(logger, tagsNumber);
      await homePage.clickNewArticleLink();
      await createArticlePage.fillTitleField(article.title);
      await createArticlePage.fillDescriptionField(article.description);
      await createArticlePage.fillTextField(article.text);
      await createArticlePage.fillTagsField(article.tags);
      await createArticlePage.clickPublishArticleButton();

      // Edytujemy artykuł – dodajemy jeden nowy tag
      const newTag = 'newTag';
      await viewArticlePage.clickEditArticleButton();
      await createArticlePage.fillTagsField([...article.tags, newTag]);
      await createArticlePage.clickPublishArticleButton();

      // Sprawdzamy, że tag został dodany
      await viewArticlePage.assertArticleTagsAreVisible([
        ...article.tags,
        newTag,
      ]);

      // Edytujemy artykuł – usuwamy pierwszy tag
      const updatedTags = [...article.tags, newTag].slice(1);
      await viewArticlePage.clickEditArticleButton();
      await createArticlePage.fillTagsField(updatedTags);
      await createArticlePage.clickPublishArticleButton();

      // Sprawdzamy, że tag został usunięty
      await viewArticlePage.assertArticleTagsAreVisible(updatedTags);
    });
  });
});
