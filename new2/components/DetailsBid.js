import React, { useEffect, useState } from 'react';

import { View, Text, SafeAreaView, Image, StatusBar, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Audio,  } from 'expo-av';
import { EthPrice } from "./SubInfo";
import { COLORS, SIZES, FONTS } from "../constants";
import PlayerModal from "./PlayerModal";
import { displayTime } from "./util";
import { styles } from "./MusicPlayer.style";
 
const DetailsBid = ({ bid, index }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [playingSong, setPlayingSong] = useState({});
  const [isBuffering, setBuffering] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [isRewinding, setRewinding] = useState(false);
  const [currentPosition, setcurrentPosition] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [playbackObject, setPlaybackObject] = useState(null);

  const playSong = async (bid, index) => {
    setModalVisible(true);
    setBuffering(true);
    setPlaying(false);
    setcurrentPosition(0);
    setCurrentSongIndex(index);
    setPlayingSong(bid);

    try {
      // Unload playback when change sound
      if (playbackObject !== null) {
        await playbackObject.unloadAsync();
      }

      // Play new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: bid.uri },
        { shouldPlay: true }
      );
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setPlaybackObject(sound);
    } catch (error) {
      alert("Can't play this song!");
    }
  };

  const onPlaybackStatusUpdate = ({
    isLoaded,
    isBuffering,
    isPlaying,
    error,
  }) => {
    if (!isLoaded) {
      if (error) {
        alert(`Encountered a fatal error during playback: ${error}`);
      }
    } else {
      setBuffering(isBuffering);
      setPlaying(isPlaying);
    }
  };

  const updatePosition = async (position) => {
    try {
      await playbackObject.setPositionAsync(position);
      setcurrentPosition(position);
      setRewinding(false);
    } catch (err) {
      console.log(err)
    }
  };

  const pauseOrResumeSong = async () => {
    if (isPlaying) {
      setPlaying(false);
      playbackObject.pauseAsync();
    } else {
      if (currentPosition === playingSong.duration) {
        setcurrentPosition(0);
        await playbackObject.replayAsync();
      } else {
        await playbackObject.playAsync();
      }
    }
  };

  const changeSong = (index) => {
    if (index < 0) index = bid.length - 1;
    else if (index == bid.length) index = 0;

    playSong(bid[index], index);
  };

  const stopPlaySong = () => {
    setModalVisible(false);
    setPlaying(false);
    playbackObject.unloadAsync();
  };

  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // Run time slider
    if (isPlaying && !isBuffering) {
      const interval = setInterval(async () => {
        const {
          positionMillis,
          durationMillis,
        } = await playbackObject.getStatusAsync();

        // Don't update position when user rewinding
        if (!isRewinding) setcurrentPosition(positionMillis || 0);

        // Stop sound if positionMillis equals durationMillis or less than 1 second
        if (positionMillis >= durationMillis - 900) {
          await playbackObject.setPositionAsync(durationMillis);
          setcurrentPosition(durationMillis);
          setPlaying(false);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, isBuffering, isRewinding]);
  return (
    <TouchableOpacity
    style={styles.listItem}
    onPress={() => playSong(bid, index)}
  >
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base,
      }}
      key={bid.id}
    >
      <Image
        source={bid.coverImage}
        resizeMode="contain"
        style={{ width: 48, height: 48 }}
      />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: SIZES.base,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.small,
            color: COLORS.primary,
          }}
        >
          Bid placed by {bid.name}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.small - 2,
            color: COLORS.secondary,
            marginTop: 3,
          }}
        >
          {bid.date}
        </Text>
      </View>

      <EthPrice price={bid.price} />
      <PlayerModal
        isModalVisible={isModalVisible}
        closeModal={stopPlaySong}
        playingSong={playingSong}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        currentSongIndex={currentSongIndex}
        currentPosition={currentPosition}
        setcurrentPosition={setcurrentPosition}
        setRewinding={setRewinding}
        updatePosition={updatePosition}
        pauseOrResumeSong={pauseOrResumeSong}
        changeSong={changeSong}
      />
    </View>
    </TouchableOpacity>
  );
};

export default DetailsBid;