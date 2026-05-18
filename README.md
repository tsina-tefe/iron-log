# IronLog 💪

A gym workout tracker built with React Native and Expo.
Create plans, log sessions, track progress over time.

---

## Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Framework  | React Native + Expo SDK 51         |
| Navigation | React Navigation 6 (Stack + Tabs)  |
| State      | Zustand                            |
| Database   | expo-sqlite (local, offline-first) |
| Charts     | Victory Native 36.9.2              |
| Fonts      | Inter via @expo-google-fonts       |
| Haptics    | expo-haptics                       |

---

## Features

- Create unlimited workout plans with custom colors
- Log sets with weight and reps during a live session
- Rest timer auto-starts after each completed set with haptic feedback
- Full session history grouped by week
- Progress charts per exercise (max weight over time)
- Personal records tracked automatically
- Workout streak counter
- Fully offline — no account needed

---

## Screens

| Tab      | Screens                       |
| -------- | ----------------------------- |
| Workouts | Plan list, Create/Edit plan   |
| Log      | Pick template, Active session |
| History  | Session list, Session detail  |
| Progress | Charts, Exercise picker, PRs  |

---

## Run Locally

```bash
git clone https://github.com/tsina-tefe/iron-log.git
cd ison-log
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

---

## Try It Live

Scan with Expo Go:

![IronLog QR Code](image.png)

Or open: `https://expo.dev/accounts/tsinatefe/projects/IronLog/updates/50ce07be-c5f6-4ddd-a5ee-56a064dd8ac8`

---

## Project Structure
