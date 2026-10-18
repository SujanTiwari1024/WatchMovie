import React from "react";
import LibraryScreen from "../../../components/LibraryScreen";
import { useUserData } from "../../../context/UserDataContext";

const FavoritesScreen = () => {
  const { favorites } = useUserData();
  return (
    <LibraryScreen
      heading="Favorites"
      data={favorites}
      emptyIcon="heart-outline"
      emptyText="No favorites yet. Open any title and tap Add to favorites."
    />
  );
};

export default FavoritesScreen;
