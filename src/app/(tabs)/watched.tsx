import React from "react";
import LibraryScreen from "../../../components/LibraryScreen";
import { useUserData } from "../../../context/UserDataContext";

const WatchedScreen = () => {
  const { watched } = useUserData();
  return (
    <LibraryScreen
      heading="Watched"
      data={watched}
      emptyIcon="checkmark-circle-outline"
      emptyText="Nothing marked as watched yet. Open a title and tap Mark as watched."
    />
  );
};

export default WatchedScreen;
