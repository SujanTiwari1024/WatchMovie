import React from "react";
import LibraryScreen from "../../../components/LibraryScreen";
import { useUserData } from "../../../context/UserDataContext";

const FavoritesScreen = () => {
  const { favorites } = useUserData();
  return (
    <LibraryScreen
      heading="Watchlist"
      data={favorites}
      emptyIcon="bookmark-outline"
      emptyText="Your watchlist is empty. Open any title and tap Add to watchlist."
    />
  );
};

export default FavoritesScreen;
