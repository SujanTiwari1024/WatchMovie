import React from "react";
import LibraryScreen from "../../../components/LibraryScreen";
import { useUserData } from "../../../context/UserDataContext";

const FavoritesScreen = () => {
  const { favorites } = useUserData();
  return (
    <LibraryScreen
      heading="Up Next"
      data={favorites}
      emptyIcon="bookmark-outline"
      countSuffix="you'd like to watch"
      emptyText="Nothing in Up Next yet. Open any title and tap Add to watchlist."
    />
  );
};

export default FavoritesScreen;
