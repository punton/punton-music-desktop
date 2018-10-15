# Punton Music Player Desktop
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
> A music player with Machine Learning techniques.
##TODO LIST 

1. Implement Javascript MFCC extraction for better extraction.
2. Using CAE (Convolutional Autoencoder) with MFCC for better accuracy 
3. Rewrite code in TFJS (TensorflowJavaScript)

## Abstraction
We report our work on exploring techniques to automatically generate the playlists for personal media player. The proposed approach intends to be able to perform on a standard personal computer platform. Given the first song, the system automatically generates the playlist from personal music collection based on the continuity of the melody and rhythm. Our technique relies only on the feature generated directly from the audio signal to avoid the problem that could arise from the lack of song tags and metadata. Two techniques, namely kd-tree and dynamic time warping, were evaluated and compared in terms of user satisfaction on the generated playlist and the execution time.

## Background and motivation
Nowadays, there are various genres of music and different people have their own taste of music. Music also has been used differently in order to create atmosphere for users while they are listening to songs. From many researches, music could be apply to many other things such as using it to abbreviate the disease or ease the pain or sorrow for any patiences. These prove the importance of the music in our life style. There is a quote from Plato state that “Music is a moral law. It gives soul to the universe, wings to the mind, flight to the imagination, and charm and gaiety to life and to everything. “ ㅡ Plato, 428 BC.
While there are many music classifiers that group music by the genre of the music or the category of music, these conditions might not be able to satisfy the user’s need in their daily lives. Rather than each individual person has to spend a lot of time each day surfing for songs they desire to listen to which wastes a lot of invaluable time. As a result, we have come up with the method of suggesting the music to users that don’t require them to surf which is by providing suggested lists of music that they prefer.

## Scope
The scope of this project is as follows:
1. Develop Recoomendation that can generate the playlist based on user current moods.
2. Considered data source are sound wave of songs.
3. Application has user interface with good user experience which makes users do not have to learn how to use.
4. Cross-platform Desktop application serves different operating system users.
5. Machine learning technique separates group of song when users import new songs to application.
#### Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn dev

# build electron application for production
yarn build

# run unit & end-to-end tests
yarn test


# lint all JS/Vue component files in `src/`
yarn lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[1c165f7](https://github.com/SimulatedGREG/electron-vue/tree/1c165f7c5e56edaf48be0fbb70838a1af26bb015) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
