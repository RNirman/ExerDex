# ExerDex 🏋️‍♂️

A modern, offline-first mobile application built with React Native and Expo to catalog, organize, and practice fitness exercises and techniques. 

## 🌟 Features

* **Offline Storage:** Saves all exercises and images locally using `AsyncStorage` and `expo-file-system`. No internet connection required.
* **Custom Image Picker:** Select visual references for exercises directly from the device gallery.
* **Drag-and-Drop Reordering:** Easily organize your workout list by long-pressing and dragging exercises into your preferred order.
* **Practice Timer:** A built-in stopwatch on the detail screen to time static holds (e.g., Planks) with "Keep Awake" functionality to prevent the screen from sleeping.
* **Modern UI/UX:** Features a sleek Dark Theme with native gestures and smooth navigation.
* **Full CRUD Functionality:** Create, Read, Update, and Delete exercise entries seamlessly.

## 📸 Screenshots

*(Note: Add your screenshots to an `assets/screenshots` folder and update these links before publishing!)*

| Home List | Add/Edit Exercise | Technique Details |
| :---: | :---: | :---: |
| <img src="./assets/homelist.jpeg" width="200" /> | <img src="./assets/add.jpeg" width="200" /> | <img src="./assets/details.jpeg" width="200" /> |

## 🛠️ Tech Stack

* **Framework:** [React Native](https://reactnative.dev/)
* **Platform/Build:** [Expo](https://expo.dev/)
* **Navigation:** React Navigation (`@react-navigation/native-stack`)
* **Local Data:** `@react-native-async-storage/async-storage`
* **File Management:** `expo-file-system`, `expo-image-picker`
* **Gestures & Animations:** `react-native-draggable-flatlist`, `react-native-reanimated`, `react-native-gesture-handler`
* **Utilities:** `expo-keep-awake`, `@expo/vector-icons`

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js installed on your machine.
* Expo Go app installed on your iOS or Android device (for local testing).

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/ExerDex.git](https://github.com/your-username/ExerDex.git)
