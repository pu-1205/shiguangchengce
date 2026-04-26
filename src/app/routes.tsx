import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Bookshelf } from "./pages/Bookshelf";
import { CategoryDetail } from "./pages/Category";
import { CoverCard } from "./pages/Cover";
import { PracticeCard } from "./pages/Practice";
import { KnowledgeCard } from "./pages/Knowledge";
import { Profile } from "./pages/Profile";
import { RunningFolder } from "./pages/RunningFolder";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "bookshelf", Component: Bookshelf },
      { path: "category/:categoryName", Component: CategoryDetail },
      { path: "cover/:videoId", Component: CoverCard },
      { path: "practice/:videoId", Component: PracticeCard },
      { path: "knowledge/:videoId", Component: KnowledgeCard },
      { path: "profile", Component: Profile },
      { path: "folder/running", Component: RunningFolder },
      { path: "*", Component: () => <div className="p-8 text-center text-gray-500 mt-20">404 - 页面未找到</div> },
    ],
  },
]);