# WatchMovie

A cross-platform (Android + iOS) movie and series discovery app built with React Native and Expo. It helps you decide **what to watch right now**: recommendations and "where to watch" are limited to the streaming services you actually have, in your own region (Finland by default).

Built as the product of a bachelor's thesis at Haaga-Helia University of Applied Sciences (2026).

## Features

- **Home**: a random trending title, personal recommendations, trending titles, your favorites, and the top titles on each of your services
- **Movies / Series**: browse by genre, sort by popularity, release date or rating, and filter to "My services" only
- **Search**: find any movie or series
- **Title details**: trailer, rating, description, cast, add to favorites, mark as watched, share
- **Where to watch**: which services stream the title in your region, with your own services first; **Watch Now** opens the streaming app
- **Favorites and Watched** lists, saved on the device
- **Profile**: choose your streaming services and region (Finland, Sweden, United States)

## How recommendations work

Recommendations are content-based (no machine learning):

1. Your 3 most common genres are taken from your favorites and watched titles.
2. TMDB is asked for popular movies and series in those genres that stream on **your services in your region**.
3. The results are ranked by how similar their genres are to your saved titles, plus their rating. Titles you've already saved are left out.

## Tech stack

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 57) with [Expo Router](https://docs.expo.dev/router/introduction/)
- TypeScript
- [TanStack Query](https://tanstack.com/query) + [Axios](https://axios-http.com/) for API calls and caching
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for data saved on the device
- [TMDB API](https://developer.themoviedb.org/) for titles, images and streaming availability

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Get a free TMDB **API Read Access Token** at <https://www.themoviedb.org/settings/api>.

3. Copy `.env.example` to `.env` and paste your token:

   ```
   EXPO_PUBLIC_TMDB_READ_TOKEN=your_token_here
   ```

4. Start the app and scan the QR code with Expo Go on your phone:

   ```bash
   npx expo start
   ```

## Project structure

```
src/app/        Screens (Expo Router: each file is a screen)
  (login)/        Login screen (start screen)
  (tabs)/         Home, Movies, Series, Favorites, Watched tabs
  details/[id]    Title details and where to watch
  profile, search, signup
components/     Reusable UI pieces (cards, rows, header, ...)
api/            TMDB requests and data types
hooks/          Data-fetching hooks (TanStack Query)
context/        User data saved on the device (favorites, services, region)
utils/          Recommendation and streaming-link logic
constants/      Colors, images, streaming services
```

## Notes

- Login and sign-up are placeholders for now: any input opens the app. Real authentication is planned.
- Watch Now opens the service's search for the title. If the service's app is installed, the phone opens the app; otherwise it opens the website.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data is provided by JustWatch.
