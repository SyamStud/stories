import AddStoryPage from '../pages/add/add-story';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import StoryDetailPage from '../pages/detail/story-detail';
import HomePage from '../pages/home/home-page';


const routes = {
  '/': () => new HomePage(),
  '/bookmark': () => new BookmarkPage(),
  '/add-story': () => new AddStoryPage(),
  '/story/:id': () => new StoryDetailPage(),
  '/login': () => new LoginPage(),
  '/register': () => new RegisterPage(),
};

export default routes;
