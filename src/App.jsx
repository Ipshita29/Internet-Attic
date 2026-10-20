import { Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import AllItems from './pages/AllItems';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import ItemDetails from './pages/ItemDetails';
import RevisitQueue from './pages/RevisitQueue';
import Tags from './pages/Tags';
import Archive from './pages/Archive';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="items" element={<AllItems />} />
        <Route path="items/:itemId" element={<ItemDetails />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="rooms/:roomId" element={<RoomDetails />} />
        <Route path="revisit" element={<RevisitQueue />} />
        <Route path="tags" element={<Tags />} />
        <Route path="archive" element={<Archive />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
